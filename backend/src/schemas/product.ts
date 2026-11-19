import { z } from "zod";

export const createProductSchema = z
  .object({
    title: z.string().trim().min(2, "Product title must be at least 2 characters"),
    handle: z.string().trim().optional(),
    price: z.number().positive("Selling price must be greater than 0"),
    compare: z.number().positive("Compare price must be greater than 0").nullable().optional(),
    categoryId: z.number().int().positive("A valid category must be selected"),
    brand: z.string().trim().min(1, "Brand is required"),
    sku: z.string().trim().nullable().optional(),
    stock: z.number().int().min(0, "Stock cannot be negative").default(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    description: z.string().trim().nullable().optional(),
    spec: z.string().trim().default(""),
    screen: z.string().trim().nullable().optional(),
    battery: z.string().trim().nullable().optional(),
    camera: z.string().trim().nullable().optional(),
    network: z.string().trim().nullable().optional(),
    warranty: z.string().trim().nullable().optional(),
    processor: z.string().trim().nullable().optional(),
    condition: z.enum(["NEW", "USED", "REFURBISHED"]).default("NEW"),
    storage: z.string().trim().nullable().optional(),
    ram: z.string().trim().nullable().optional(),
    color: z.string().trim().nullable().optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").nullable().optional(),
    supplier: z.string().trim().nullable().optional(),
    finishes: z.array(z.string().trim()).default([]),
    images: z.array(z.string().trim()).default([]),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false)
  })
  .refine(
    (data) => data.compare == null || data.compare > data.price,
    {
      message: "Compare at price (original price) must be greater than the selling price",
      path: ["compare"]
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    title: z.string().trim().min(2, "Product title must be at least 2 characters").optional(),
    handle: z.string().trim().optional(),
    regenerateHandle: z.boolean().optional(),
    price: z.number().positive("Selling price must be greater than 0").optional(),
    compare: z.number().positive("Compare price must be greater than 0").nullable().optional(),
    categoryId: z.number().int().positive("A valid category must be selected").optional(),
    brand: z.string().trim().min(1, "Brand is required").optional(),
    sku: z.string().trim().nullable().optional(),
    stock: z.number().int().min(0, "Stock cannot be negative").optional(),
    lowStockThreshold: z.number().int().min(0).optional(),
    description: z.string().trim().nullable().optional(),
    spec: z.string().trim().optional(),
    screen: z.string().trim().nullable().optional(),
    battery: z.string().trim().nullable().optional(),
    camera: z.string().trim().nullable().optional(),
    network: z.string().trim().nullable().optional(),
    warranty: z.string().trim().nullable().optional(),
    processor: z.string().trim().nullable().optional(),
    condition: z.enum(["NEW", "USED", "REFURBISHED"]).optional(),
    storage: z.string().trim().nullable().optional(),
    ram: z.string().trim().nullable().optional(),
    color: z.string().trim().nullable().optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").nullable().optional(),
    supplier: z.string().trim().nullable().optional(),
    finishes: z.array(z.string().trim()).optional(),
    images: z.array(z.string().trim()).optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional()
  })
  .refine(
    (data) => {
      if (data.price !== undefined && data.compare !== undefined && data.compare !== null) {
        return data.compare > data.price;
      }
      return true;
    },
    {
      message: "Compare at price must be greater than the selling price",
      path: ["compare"]
    }
  );

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const bulkProductActionSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "Select at least one product"),
  action: z.enum(["activate", "deactivate", "delete", "archive"])
});

export type BulkProductActionInput = z.infer<typeof bulkProductActionSchema>;

export const productStockUpdateSchema = z.object({
  stock: z.number().int().min(0, "Stock cannot be negative")
});

export type ProductStockUpdateInput = z.infer<typeof productStockUpdateSchema>;
