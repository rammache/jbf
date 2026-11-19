import { Router } from "express";
import { getProducts, getProductByHandle, getBrands } from "../controllers/productController.js";
import { getCategories } from "../controllers/categoryController.js";
import { createOrder, getOrder } from "../controllers/orderController.js";
import { subscribeNewsletter } from "../controllers/newsletterController.js";

const router = Router();

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
