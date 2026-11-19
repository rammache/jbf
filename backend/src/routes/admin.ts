import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody } from "../middleware/validate.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { changePasswordSchema } from "../schemas/auth.js";
import { changePassword } from "../controllers/authController.js";
import {
  adminGetCategories,
  adminGetCategoryById,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminReorderCategories
} from "../controllers/categoryController.js";
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema
} from "../schemas/category.js";
import {
  adminGetProducts,
  adminGetProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminDuplicateProduct,
  adminBulkProductActions,
  adminUploadImages
} from "../controllers/adminProductController.js";

const router = Router();

router.use(requireAdmin);

// Admin security & settings
router.post("/change-password", validateBody(changePasswordSchema), changePassword);

// Image Uploads (up to 10 images at once)
router.post("/upload", uploadMiddleware.array("images", 10), adminUploadImages);

// Category management
router.get("/categories", adminGetCategories);
router.post("/categories", validateBody(createCategorySchema), adminCreateCategory);
router.put("/categories/reorder", validateBody(reorderCategoriesSchema), adminReorderCategories);
router.get("/categories/:id", adminGetCategoryById);
router.put("/categories/:id", validateBody(updateCategorySchema), adminUpdateCategory);
router.delete("/categories/:id", adminDeleteCategory);

// Product management
router.get("/products", adminGetProducts);
router.post("/products", adminCreateProduct);
router.post("/products/bulk", adminBulkProductActions);
router.get("/products/:id", adminGetProductById);
router.put("/products/:id", adminUpdateProduct);
router.delete("/products/:id", adminDeleteProduct);
router.post("/products/:id/duplicate", adminDuplicateProduct);

export default router;
