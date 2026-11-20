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
import {
  adminGetReviews,
  adminToggleApproveReview,
  adminDeleteReview
} from "../controllers/reviewController.js";
import {
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
  adminCancelOrder,
  adminDeleteOrder
} from "../controllers/adminOrderController.js";
import { updateOrderStatusSchema } from "../schemas/order.js";
import {
  adminGetDashboardMetrics,
  adminGetProfitReport
} from "../controllers/adminDashboardController.js";
import {
  adminGetStoreSettings,
  adminUpdateStoreSettings
} from "../controllers/settingsController.js";
import {
  adminGetNewsletterSubscribers,
  adminExportNewsletterCsv,
  adminDeleteNewsletterSubscriber
} from "../controllers/newsletterController.js";
import {
  adminGetCoupons,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminDeleteCoupon
} from "../controllers/couponController.js";
import {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} from "../controllers/adminUserController.js";
import { updateStoreSettingsSchema } from "../schemas/settings.js";
import { createCouponSchema, updateCouponSchema } from "../schemas/coupon.js";
import { createAdminUserSchema, updateAdminUserSchema } from "../schemas/adminUser.js";

const router = Router();

router.use(requireAdmin);

// Admin Dashboard & Analytics
router.get("/dashboard", adminGetDashboardMetrics);
router.get("/reports/profit", adminGetProfitReport);

// Admin security & store settings
router.post("/change-password", validateBody(changePasswordSchema), changePassword);
router.get("/settings", adminGetStoreSettings);
router.put("/settings", validateBody(updateStoreSettingsSchema), adminUpdateStoreSettings);

// Newsletter Subscribers
router.get("/newsletter", adminGetNewsletterSubscribers);
router.get("/newsletter/export", adminExportNewsletterCsv);
router.delete("/newsletter/:id", adminDeleteNewsletterSubscriber);

// Coupons & Promotions
router.get("/coupons", adminGetCoupons);
router.post("/coupons", validateBody(createCouponSchema), adminCreateCoupon);
router.put("/coupons/:id", validateBody(updateCouponSchema), adminUpdateCoupon);
router.delete("/coupons/:id", adminDeleteCoupon);

// Admin Accounts & Role Management
router.get("/users", adminGetUsers);
router.post("/users", validateBody(createAdminUserSchema), adminCreateUser);
router.put("/users/:id", validateBody(updateAdminUserSchema), adminUpdateUser);
router.delete("/users/:id", adminDeleteUser);

// Image Uploads (up to 10 images at once)
router.post("/upload", uploadMiddleware.array("images", 10) as any, adminUploadImages);

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

// Customer Review Moderation
router.get("/reviews", adminGetReviews);
router.put("/reviews/:id/approve", adminToggleApproveReview);
router.delete("/reviews/:id", adminDeleteReview);

// Order Management
router.get("/orders", adminGetOrders);
router.get("/orders/:id", adminGetOrderById);
router.put("/orders/:id/status", validateBody(updateOrderStatusSchema), adminUpdateOrderStatus);
router.post("/orders/:id/cancel", adminCancelOrder);
router.delete("/orders/:id", adminDeleteOrder);

export default router;
