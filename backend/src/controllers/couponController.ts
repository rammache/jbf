import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema
} from "../schemas/coupon.js";
import { toNumber, toDecimal } from "../utils/decimal.js";

export function calculateCouponDiscount(
  subtotal: number,
  discountType: string,
  discountValue: number,
  maxDiscount?: number | null
): number {
  if (subtotal <= 0) return 0;

  let discount = 0;
  if (discountType === "PERCENTAGE") {
    discount = (subtotal * discountValue) / 100;
    if (maxDiscount && maxDiscount > 0) {
      discount = Math.min(discount, maxDiscount);
    }
  } else {
    // FIXED
    discount = Math.min(discountValue, subtotal);
  }

  return Math.round(discount * 100) / 100;
}

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = validateCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid coupon validation payload"
      });
      return;
    }

    const { code, subtotal } = parsed.data;

    const coupon = await prisma.coupon.findUnique({
      where: { code }
    });

    if (!coupon) {
      res.status(404).json({
        success: false,
        error: "Coupon code does not exist"
      });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({
        success: false,
        error: "This coupon is currently inactive"
      });
      return;
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      res.status(400).json({
        success: false,
        error: "This coupon has expired"
      });
      return;
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({
        success: false,
        error: "This coupon has reached its maximum usage limit"
      });
      return;
    }

    const minAmount = coupon.minOrderAmount ? toNumber(coupon.minOrderAmount) : null;
    if (minAmount && subtotal < minAmount) {
      res.status(400).json({
        success: false,
        error: `Minimum order amount of $${minAmount.toFixed(2)} required to use this coupon`
      });
      return;
    }

    const discValue = toNumber(coupon.discountValue);
    const maxDisc = coupon.maxDiscount ? toNumber(coupon.maxDiscount) : null;

    const discountAmount = calculateCouponDiscount(
      subtotal,
      coupon.discountType,
      discValue,
      maxDisc
    );

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: discValue,
        calculatedDiscount: discountAmount,
        minOrderAmount: minAmount,
        maxDiscount: maxDisc
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to validate coupon code at this time";
    console.error("Error validating coupon:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};

export const adminGetCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status : "all";

    const where: Prisma.CouponWhereInput = {};
    if (q) {
      where.code = { contains: q, mode: "insensitive" };
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    const totalCoupons = await prisma.coupon.count();
    const activeCoupons = await prisma.coupon.count({ where: { isActive: true } });
    const aggregateUsed = await prisma.coupon.aggregate({
      _sum: { usedCount: true }
    });

    res.json({
      success: true,
      data: coupons,
      stats: {
        totalCoupons,
        activeCoupons,
        totalUsed: aggregateUsed._sum.usedCount || 0
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load coupons";
    console.error("Admin error fetching coupons:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};

export const adminCreateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid coupon data"
      });
      return;
    }

    const existing = await prisma.coupon.findUnique({
      where: { code: parsed.data.code }
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: `Coupon with code "${parsed.data.code}" already exists`
      });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.data.code,
        discountType: parsed.data.discountType,
        discountValue: toDecimal(parsed.data.discountValue),
        minOrderAmount: parsed.data.minOrderAmount != null ? toDecimal(parsed.data.minOrderAmount) : null,
        maxDiscount: parsed.data.maxDiscount != null ? toDecimal(parsed.data.maxDiscount) : null,
        usageLimit: parsed.data.usageLimit ?? null,
        isActive: parsed.data.isActive ?? true,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
      }
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred while creating coupon";
    console.error("Failed to create coupon:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};

export const adminUpdateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ success: false, error: "Invalid coupon ID" });
      return;
    }

    const parsed = updateCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid coupon update payload"
      });
      return;
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      res.status(404).json({ success: false, error: "Coupon not found" });
      return;
    }

    if (parsed.data.code && parsed.data.code !== coupon.code) {
      const duplicate = await prisma.coupon.findUnique({
        where: { code: parsed.data.code }
      });
      if (duplicate) {
        res.status(409).json({
          success: false,
          error: `Coupon code "${parsed.data.code}" is already in use`
        });
        return;
      }
    }

    const updateData: Prisma.CouponUpdateInput = {
      ...(parsed.data.code ? { code: parsed.data.code } : {}),
      ...(parsed.data.discountType ? { discountType: parsed.data.discountType } : {}),
      ...(parsed.data.discountValue !== undefined ? { discountValue: toDecimal(parsed.data.discountValue) } : {}),
      ...(parsed.data.minOrderAmount !== undefined
        ? { minOrderAmount: parsed.data.minOrderAmount !== null ? toDecimal(parsed.data.minOrderAmount) : null }
        : {}),
      ...(parsed.data.maxDiscount !== undefined
        ? { maxDiscount: parsed.data.maxDiscount !== null ? toDecimal(parsed.data.maxDiscount) : null }
        : {}),
      ...(parsed.data.usageLimit !== undefined ? { usageLimit: parsed.data.usageLimit } : {}),
      ...(parsed.data.isActive !== undefined ? { isActive: parsed.data.isActive } : {}),
      ...(parsed.data.expiresAt !== undefined
        ? { expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null }
        : {})
    };

    const updated = await prisma.coupon.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: "Coupon updated successfully",
      data: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update coupon";
    console.error("Failed to update coupon:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};

export const adminDeleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ success: false, error: "Invalid coupon ID" });
      return;
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      res.status(404).json({ success: false, error: "Coupon not found" });
      return;
    }

    await prisma.coupon.delete({ where: { id } });

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully`
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to delete coupon";
    console.error("Failed to delete coupon:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};
