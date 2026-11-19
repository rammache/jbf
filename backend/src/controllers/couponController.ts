import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema
} from "../schemas/coupon.js";

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

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const parsed = validateCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid coupon validation payload"
      });
    }

    const { code, subtotal } = parsed.data;

    const coupon = await prisma.coupon.findUnique({
      where: { code }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: "Coupon code does not exist"
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        error: "This coupon is currently inactive"
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "This coupon has expired"
      });
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        error: "This coupon has reached its maximum usage limit"
      });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of $${coupon.minOrderAmount.toFixed(2)} required to use this coupon`
      });
    }

    const discountAmount = calculateCouponDiscount(
      subtotal,
      coupon.discountType,
      coupon.discountValue,
      coupon.maxDiscount
    );

    return res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: discountAmount,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount
      }
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to validate coupon code at this time"
    });
  }
};

export const adminGetCoupons = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status : "all";

    const where: any = {};
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

    return res.json({
      success: true,
      data: coupons,
      stats: {
        totalCoupons,
        activeCoupons,
        totalUsed: aggregateUsed._sum.usedCount || 0
      }
    });
  } catch (error) {
    console.error("Admin error fetching coupons:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to load coupons"
    });
  }
};

export const adminCreateCoupon = async (req: Request, res: Response) => {
  try {
    const parsed = createCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid coupon data"
      });
    }

    const existing = await prisma.coupon.findUnique({
      where: { code: parsed.data.code }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Coupon with code "${parsed.data.code}" already exists`
      });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.data.code,
        discountType: parsed.data.discountType,
        discountValue: parsed.data.discountValue,
        minOrderAmount: parsed.data.minOrderAmount ?? null,
        maxDiscount: parsed.data.maxDiscount ?? null,
        usageLimit: parsed.data.usageLimit ?? null,
        isActive: parsed.data.isActive ?? true,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while creating coupon"
    });
  }
};

export const adminUpdateCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, error: "Invalid coupon ID" });
    }

    const parsed = updateCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid coupon update payload"
      });
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ success: false, error: "Coupon not found" });
    }

    if (parsed.data.code && parsed.data.code !== coupon.code) {
      const duplicate = await prisma.coupon.findUnique({
        where: { code: parsed.data.code }
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          error: `Coupon code "${parsed.data.code}" is already in use`
        });
      }
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...parsed.data,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : parsed.data.expiresAt === null ? null : undefined
      }
    });

    return res.json({
      success: true,
      message: "Coupon updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to update coupon"
    });
  }
};

export const adminDeleteCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, error: "Invalid coupon ID" });
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ success: false, error: "Coupon not found" });
    }

    await prisma.coupon.delete({ where: { id } });

    return res.json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully`
    });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to delete coupon"
    });
  }
};
