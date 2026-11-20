import { Router } from "express";
import { login, logout, me } from "../controllers/authController.js";
import { getProducts, getProductByHandle, getBrands } from "../controllers/productController.js";
import { getCategories } from "../controllers/categoryController.js";
import { createOrder, getOrder, trackOrder } from "../controllers/orderController.js";
import { subscribeNewsletter } from "../controllers/newsletterController.js";
import { getProductReviews, createProductReview } from "../controllers/reviewController.js";
import { getStoreSettings } from "../controllers/settingsController.js";
import { validateCoupon } from "../controllers/couponController.js";
import { validateBody } from "../middleware/validate.js";
import {
  loginRateLimiter,
  orderRateLimiter,
  newsletterRateLimiter
} from "../middleware/rateLimit.js";
import { loginSchema } from "../schemas/auth.js";
import { createOrderSchema, trackOrderSchema } from "../schemas/order.js";
import adminRoutes from "./admin.js";

const router = Router();

// Admin auth
router.post("/auth/login", loginRateLimiter as any, validateBody(loginSchema), login);
router.get("/auth/me", me);
router.post("/auth/logout", logout);

router.use("/admin", adminRoutes);

// Products
router.get("/products", getProducts);
router.get("/products/:handle", getProductByHandle);
router.get("/brands", getBrands);

// Reviews
router.get("/products/:handle/reviews", getProductReviews);
router.post("/products/:id/reviews", createProductReview);

// Categories
router.get("/categories", getCategories);

// Orders & Checkout
router.post("/orders", orderRateLimiter as any, validateBody(createOrderSchema), createOrder);
router.post("/orders/track", validateBody(trackOrderSchema), trackOrder);
router.get("/orders/:id", getOrder);

// Newsletter
router.post("/newsletter", newsletterRateLimiter as any, subscribeNewsletter);

// Store Settings & Policies
router.get("/settings", getStoreSettings);

// Coupon Validation for Checkout
router.post("/coupons/validate", validateCoupon);

export default router;
