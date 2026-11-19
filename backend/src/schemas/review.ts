import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  authorName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Comment cannot exceed 1000 characters")
});

export const trackOrderSchema = z.object({
  orderId: z.string().trim().min(1, "Order ID cannot be empty"),
  contact: z.string().trim().min(3, "Please provide your email address")
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
