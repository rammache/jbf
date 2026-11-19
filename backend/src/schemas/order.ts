import { z } from "zod";

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
] as const;

export type OrderStatusType = (typeof ORDER_STATUSES)[number];

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const orderItemInputSchema = z.object({
  productId: z.number().int().positive("Valid product ID is required"),
  title: z.string().optional(),
  selectedFinish: z.string().nullable().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  // Client-submitted price is ignored on the server, but accepted in payload for compatibility
  price: z.number().optional()
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Full name is required (at least 2 characters)"),
  customerEmail: z.string().trim().email("A valid email address is required"),
  customerPhone: z
    .string()
    .trim()
    .min(6, "A valid contact phone number is required for delivery (at least 6 digits)")
    .regex(/^[\d\s+\-().]{6,25}$/, "Please enter a valid phone number format"),
  customerAddress: z.string().trim().min(5, "Delivery address is required (at least 5 characters)"),
  city: z.string().trim().min(2, "City is required").default("Beirut"),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional().nullable(),
  paymentMethod: z.enum(["COD", "CARD"]).default("COD"),
  items: z.array(orderItemInputSchema).min(1, "Your cart must contain at least one item to checkout")
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  notes: z.string().optional()
});

export const trackOrderSchema = z.object({
  orderId: z.string().trim().min(1, "Please provide your order reference number or ID"),
  contact: z.string().trim().min(1, "Please provide your checkout email address or phone number")
});

export const adminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: orderStatusSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "totalAmount", "orderNumber", "customerName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
