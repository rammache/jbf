import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .trim()
    .min(1, "Email is required.")
    .email("Please provide a valid email address.")
    .toLowerCase(),
  password: z
    .string({ message: "Password is required." })
    .min(1, "Password is required.")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Current password is required." })
      .min(1, "Current password is required."),
    newPassword: z
      .string({ message: "New password is required." })
      .min(12, "New password must be at least 12 characters long."),
    confirmPassword: z
      .string({ message: "Password confirmation is required." })
      .min(1, "Password confirmation is required.")
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"]
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"]
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
