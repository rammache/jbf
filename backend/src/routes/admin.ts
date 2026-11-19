import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody } from "../middleware/validate.js";
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

const router = Router();

router.use(requireAdmin);

// Admin security & settings
router.post("/change-password", validateBody(changePasswordSchema), changePassword);

// Category management
router.get("/categories", adminGetCategories);
router.post("/categories", validateBody(createCategorySchema), adminCreateCategory);
router.put("/categories/reorder", validateBody(reorderCategoriesSchema), adminReorderCategories);
router.get("/categories/:id", adminGetCategoryById);
router.put("/categories/:id", validateBody(updateCategorySchema), adminUpdateCategory);
router.delete("/categories/:id", adminDeleteCategory);

export default router;
