import { z } from "zod";

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(2, "Coupon code must be at least 2 characters")
    .max(30, "Coupon code cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Coupon code can only contain letters, numbers, hyphens, and underscores")
    .transform((val) => val.toUpperCase().trim()),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    message: "Discount type must be PERCENTAGE or FIXED"
  }),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  minOrderAmount: z.number().min(0).nullable().optional(),
  maxDiscount: z.number().positive().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().nullable().optional()
}).refine(
  (data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Percentage discount cannot exceed 100%",
    path: ["discountValue"]
  }
);

export const updateCouponSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .transform((val) => val.toUpperCase().trim())
    .optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  minOrderAmount: z.number().min(0).nullable().optional(),
  maxDiscount: z.number().positive().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional()
}).refine(
  (data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Percentage discount cannot exceed 100%",
    path: ["discountValue"]
  }
);

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").transform((val) => val.toUpperCase().trim()),
  subtotal: z.number().min(0, "Subtotal must be non-negative")
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
