import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody } from "../middleware/validate.js";
import { changePasswordSchema } from "../schemas/auth.js";
import { changePassword } from "../controllers/authController.js";

const router = Router();

router.use(requireAdmin);

router.post("/change-password", validateBody(changePasswordSchema), changePassword);

export default router;
