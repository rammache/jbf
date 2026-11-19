import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { createReviewSchema } from "../schemas/review.js";

/**
 * Recalculates and updates product rating and reviews count based on approved reviews.
 */
export async function recalculateProductRating(productId: number): Promise<void> {
  const approvedReviews = await prisma.review.findMany({
    where: { productId, isApproved: true }
  });

  const count = approvedReviews.length;
  const avg =
    count > 0
      ? +(approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
      : 5.0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: avg,
      reviews: count
    }
  });
}

/**
 * Public: Get approved reviews for a product by handle.
 * GET /api/products/:handle/reviews
 */
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { handle } = req.params;

    const product = await prisma.product.findUnique({
      where: { handle },
      select: { id: true }
    });

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        isApproved: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load reviews" });
  }
};

/**
 * Public: Submit a review for a product.
 * POST /api/products/:id/reviews
 */
export const createProductReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ success: false, error: "Invalid product ID" });
      return;
    }

    const validation = createReviewSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.issues?.[0]?.message || "Invalid review data"
      });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.isArchived) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // By default, approve immediately for demo / responsive UX, with admin moderation power
    const review = await prisma.review.create({
      data: {
        productId,
        rating: validation.data.rating,
        authorName: validation.data.authorName,
        comment: validation.data.comment,
        isApproved: true
      }
    });

    // Update product rating and reviews aggregate
    await recalculateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Thank you for submitting your review!",
      data: review
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to submit review" });
  }
};

/**
 * Admin: List all customer reviews.
 * GET /api/admin/reviews
 */
export const adminGetReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            handle: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load reviews" });
  }
};

/**
 * Admin: Toggle review approval status.
 * PUT /api/admin/reviews/:id/approve
 */
export const adminToggleApproveReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid review ID" });
      return;
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ success: false, error: "Review not found" });
      return;
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: !review.isApproved }
    });

    await recalculateProductRating(review.productId);

    res.json({
      success: true,
      message: `Review ${updated.isApproved ? "approved" : "unapproved"} successfully`,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update review" });
  }
};

/**
 * Admin: Delete a review.
 * DELETE /api/admin/reviews/:id
 */
export const adminDeleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid review ID" });
      return;
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ success: false, error: "Review not found" });
      return;
    }

    await prisma.review.delete({ where: { id } });
    await recalculateProductRating(review.productId);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to delete review" });
  }
};
