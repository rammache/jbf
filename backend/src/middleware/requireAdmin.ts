import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ADMIN_AUTH_COOKIE_NAME, getAdminCookieOptions } from "../utils/authCookie.js";
import { verifyAdminToken } from "../utils/jwt.js";

const ADMIN_ROLE = "ADMIN";

export interface AuthenticatedAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.[ADMIN_AUTH_COOKIE_NAME];
  const payload = typeof token === "string" ? verifyAdminToken(token) : null;
  const adminId = payload ? Number(payload.sub) : NaN;

  if (!payload || !Number.isInteger(adminId) || adminId <= 0) {
    res.clearCookie(ADMIN_AUTH_COOKIE_NAME, getAdminCookieOptions());
    res.status(401).json({ success: false, error: "You are not signed in." });
    return;
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });

    if (!admin) {
      res.clearCookie(ADMIN_AUTH_COOKIE_NAME, getAdminCookieOptions());
      res.status(401).json({ success: false, error: "You are not signed in." });
      return;
    }

    if (admin.role !== ADMIN_ROLE) {
      res.status(403).json({ success: false, error: "Admin access required." });
      return;
    }

    req.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
    res.setHeader("Cache-Control", "no-store");
    next();
  } catch {
    res.status(500).json({ success: false, error: "Unable to verify admin access." });
  }
}
