import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerEmail, customerName, customerAddress, items } = req.body;

    if (!customerEmail || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: "Invalid order details" });
      return;
    }

    // Validate stock and verify products exist
    for (const item of items) {
      const productId = item.productId;
      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);

      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product || product.isArchived) {
        return res.status(400).json({
          success: false,
          error: `Product '${item.title || "Unknown"}' is no longer available.`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          error: `Product '${product.title}' is currently unavailable.`
        });
      }

      if (product.stock <= 0) {
        return res.status(400).json({
          success: false,
          error: `Product '${product.title}' is out of stock.`
        });
      }

      if (product.stock < requestedQty) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stock} unit(s) of '${product.title}' are available in stock (requested ${requestedQty}).`
        });
      }
    }

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += (item.price || 0) * (item.quantity || 1);
    }

    // Execute order creation and stock decrements atomically in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement inventory for each ordered item
      for (const item of items) {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: qty }
          }
        });
      }

      // Create the order
      return tx.order.create({
        data: {
          customerEmail,
          customerName,
          customerAddress: customerAddress || "N/A",
          totalAmount,
          status: "COMPLETED",
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productTitle: item.title,
              selectedFinish: item.selectedFinish || null,
              quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
