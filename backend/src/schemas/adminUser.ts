import { z } from "zod";

export const createAdminUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").transform((v) => v.toLowerCase().trim()),
  password: z.string().min(12, "Password must be at least 12 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]).default("ADMIN")
});

export const updateAdminUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]).optional(),
  password: z.string().min(12, "Password must be at least 12 characters").optional()
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
