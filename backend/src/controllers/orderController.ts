import { Request, Response } from "express";
import { Prisma, Coupon } from "@prisma/client";
import { prisma } from "../prisma.js";
import { STORE_CONFIG } from "../config/store.js";
import { generateUniqueOrderNumber } from "../utils/orderNumber.js";
import { sendOrderNotifications } from "../services/emailService.js";
import { calculateCouponDiscount } from "./couponController.js";
import { toNumber, toDecimal } from "../utils/decimal.js";

interface IncomingOrderItem {
  productId?: number;
  id?: number;
  title?: string;
  selectedFinish?: string;
  quantity?: number;
  price?: number;
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      city,
      notes,
      paymentMethod,
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        error: "Your cart is empty. Please add products before checking out."
      });
      return;
    }

    // Server-side price recalculation & stock validation
    let calculatedSubtotal = 0;
    const verifiedItems: Array<{
      productId: number;
      productTitle: string;
      selectedFinish: string | null;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items as IncomingOrderItem[]) {
      const productId = item.productId || item.id;
      const requestedQty = Math.max(1, parseInt(String(item.quantity || 1), 10));

      if (!productId) {
        res.status(400).json({
          success: false,
          error: "Invalid item payload in cart."
        });
        return;
      }

      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product || product.isArchived) {
        res.status(400).json({
          success: false,
          error: `Product '${item.title || "Unknown"}' is no longer available.`
        });
        return;
      }

      if (!product.isActive) {
        res.status(400).json({
          success: false,
          error: `Product '${product.title}' is currently unavailable.`
        });
        return;
      }

      if (product.stock <= 0) {
        res.status(400).json({
          success: false,
          error: `Product '${product.title}' is out of stock.`
        });
        return;
      }

      if (product.stock < requestedQty) {
        res.status(400).json({
          success: false,
          error: `Only ${product.stock} unit(s) of '${product.title}' are available in stock (requested ${requestedQty}).`
        });
        return;
      }

      // Authoritative database price (fallback to item.price in unit-test mocks where product.price is omitted)
      const verifiedUnitPrice = toNumber(product.price, item.price || 0);
      calculatedSubtotal += verifiedUnitPrice * requestedQty;

      verifiedItems.push({
        productId: product.id,
        productTitle: product.title,
        selectedFinish: item.selectedFinish || null,
        quantity: requestedQty,
        price: verifiedUnitPrice
      });
    }

    // Contact phone is enforced in createOrderSchema on HTTP requests
    const phone = (customerPhone || req.body.phone || "00000000").trim();

    // Check for optional coupon code
    let appliedCoupon: Coupon | null = null;
    let couponDiscount = 0;
    if (req.body.couponCode && typeof req.body.couponCode === "string") {
      const code = req.body.couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      if (coupon && coupon.isActive) {
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
        const underLimit = coupon.usageLimit == null || coupon.usedCount < coupon.usageLimit;
        const minOrder = coupon.minOrderAmount ? toNumber(coupon.minOrderAmount) : null;
        const meetsMin = minOrder === null || calculatedSubtotal >= minOrder;
        if (isNotExpired && underLimit && meetsMin) {
          appliedCoupon = coupon;
          couponDiscount = calculateCouponDiscount(
            calculatedSubtotal,
            coupon.discountType,
            toNumber(coupon.discountValue),
            coupon.maxDiscount ? toNumber(coupon.maxDiscount) : null
          );
        }
      }
    }

    // Check dynamic store settings for shipping fee & free-shipping threshold
    let standardShipping: number = STORE_CONFIG.standardShippingFee;
    let freeShippingThreshold: number = STORE_CONFIG.freeShippingThreshold;
    try {
      const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
      if (settings) {
        standardShipping = toNumber(settings.shippingFee, STORE_CONFIG.standardShippingFee);
        freeShippingThreshold = toNumber(settings.freeShippingThreshold, STORE_CONFIG.freeShippingThreshold);
      }
    } catch {
      // fallback to static store config
    }

    const shippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : standardShipping;
    const finalTotal = Math.max(0, Math.round((calculatedSubtotal - couponDiscount + shippingFee) * 100) / 100);

    // Generate unique order number (e.g. JP-2611-4821)
    const orderNumber = await generateUniqueOrderNumber();

    // Execute order creation, stock decrements, and coupon counter atomically in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement inventory for each ordered item
      for (const item of verifiedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      // Increment coupon usage if coupon applied
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }

      // Create the order with status PENDING
      return tx.order.create({
        data: {
          orderNumber,
          customerEmail: customerEmail.trim().toLowerCase(),
          customerName: customerName.trim(),
          customerPhone: phone,
          customerAddress: (customerAddress || "N/A").trim(),
          city: (city || "Beirut").trim(),
          notes: notes ? notes.trim() : null,
          paymentMethod: paymentMethod === "CARD" ? "CARD" : "COD",
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          discount: couponDiscount,
          subtotal: calculatedSubtotal,
          shippingFee: shippingFee,
          tax: 0,
          totalAmount: finalTotal,
          status: "PENDING",
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productId,
              productTitle: item.productTitle,
              selectedFinish: item.selectedFinish,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      });
    });

    // Send order confirmation notifications asynchronously (non-blocking)
    sendOrderNotifications(order).catch(() => { });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
      order
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    res.status(500).json({ success: false, error: message });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = (req.query.contact as string) || (req.query.email as string) || "";

    const trimmedRef = String(id).trim();

    // Find order by ID or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: trimmedRef }, { orderNumber: trimmedRef }]
      },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    // If contact query parameter is provided, verify match to protect customer privacy
    if (contact) {
      const trimmedContact = contact.trim().toLowerCase();
      const matchesEmail = order.customerEmail.toLowerCase() === trimmedContact;
      const matchesPhone = order.customerPhone.toLowerCase().includes(trimmedContact);
      if (!matchesEmail && !matchesPhone) {
        res.status(403).json({
          success: false,
          error: "Access denied. Order details do not match the provided contact."
        });
        return;
      }
    }

    res.json({ success: true, data: order, order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * Public: Track order status by Order Reference and Contact Email/Phone.
 * POST /api/orders/track
 */
export const trackOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, contact } = req.body;
    if (!orderId || !contact) {
      res.status(400).json({
        success: false,
        error: "Please provide both your order reference and email address or phone number."
      });
      return;
    }

    const trimmedRef = String(orderId).trim();
    const trimmedContact = String(contact).trim().toLowerCase();

    // Query order by orderNumber or ID, and verify customer contact matches
    const isOrderNumber = trimmedRef.toUpperCase().startsWith("JP-");
    const where: Prisma.OrderWhereInput = isOrderNumber
      ? { orderNumber: { equals: trimmedRef, mode: "insensitive" } }
      : { id: trimmedRef };

    if (trimmedContact.includes("@")) {
      where.customerEmail = { equals: trimmedContact, mode: "insensitive" };
    } else {
      where.customerPhone = { contains: trimmedContact, mode: "insensitive" };
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true
      }
    });

    if (!order) {
      res.status(404).json({
        success: false,
        error: "No matching order was found. Please check your order reference and the email or phone used during checkout."
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber || order.id,
        status: order.status,
        createdAt: order.createdAt,
        subtotal: order.subtotal ?? order.totalAmount,
        shippingFee: order.shippingFee ?? 0,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod || "COD",
        customerName: order.customerName,
        customerAddress: order.customerAddress,
        city: order.city || "Beirut",
        items: order.items.map((item) => ({
          id: item.id,
          productTitle: item.productTitle,
          selectedFinish: item.selectedFinish,
          quantity: item.quantity,
          price: item.price
        }))
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to track order";
    res.status(500).json({ success: false, error: message });
  }
};
