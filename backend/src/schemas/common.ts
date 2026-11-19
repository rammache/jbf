import { z } from "zod";

/**
 * Common Query Schemas for List and Search Endpoints
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

export const numericIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid identifier")
});

export const stringIdParamSchema = z.object({
  id: z.string().trim().min(1, "Identifier is required")
});
