import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { changePassword } from "../controllers/authController.js";

const router = Router();

router.use(requireAdmin);

router.post("/change-password", changePassword);

export default router;
