import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ message: "Category name is required." })
    .trim()
    .min(1, "Category name is required.")
    .max(100, "Category name must be at most 100 characters."),
  slug: z
    .string()
    .trim()
    .max(120, "Slug must be at most 120 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens.")
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters.")
    .optional()
    .nullable(),
  image: z
    .string()
    .trim()
    .optional()
    .nullable(),
  sortOrder: z
    .number()
    .int("Sort order must be an integer.")
    .min(0, "Sort order must be greater than or equal to 0.")
    .optional(),
  isActive: z
    .boolean()
    .optional()
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name cannot be empty.")
    .max(100, "Category name must be at most 100 characters.")
    .optional(),
  slug: z
    .string()
    .trim()
    .max(120, "Slug must be at most 120 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens.")
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters.")
    .optional()
    .nullable(),
  image: z
    .string()
    .trim()
    .optional()
    .nullable(),
  sortOrder: z
    .number()
    .int("Sort order must be an integer.")
    .min(0, "Sort order must be greater than or equal to 0.")
    .optional(),
  isActive: z
    .boolean()
    .optional(),
  regenerateSlug: z
    .boolean()
    .optional()
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const reorderCategoriesSchema = z.object({
  orders: z
    .array(
      z.object({
        id: z.number().int("Category ID must be an integer."),
        sortOrder: z.number().int("Sort order must be an integer.").min(0)
      })
    )
    .min(1, "Orders array cannot be empty.")
});

export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;

export const deleteCategorySchema = z.object({
  reassignToCategoryId: z
    .number()
    .int("Target category ID must be an integer.")
    .optional()
    .nullable()
});

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
