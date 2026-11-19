import { Router } from "express";
import { login, logout, me } from "../controllers/authController.js";
import { getProducts, getProductByHandle, getBrands } from "../controllers/productController.js";
import { getCategories } from "../controllers/categoryController.js";
import { createOrder, getOrder } from "../controllers/orderController.js";
import { subscribeNewsletter } from "../controllers/newsletterController.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "../schemas/auth.js";
import adminRoutes from "./admin.js";

const router = Router();

// Admin auth
router.post("/auth/login", validateBody(loginSchema), login);
router.get("/auth/me", me);
router.post("/auth/logout", logout);

router.use("/admin", adminRoutes);

// Products
router.get("/products", getProducts);
router.get("/products/:handle", getProductByHandle);
router.get("/brands", getBrands);

// Categories
router.get("/categories", getCategories);

// Orders & Checkout
router.post("/orders", createOrder);
router.get("/orders/:id", getOrder);

// Newsletter
router.post("/newsletter", subscribeNewsletter);

export default router;
