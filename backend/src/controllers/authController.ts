import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ADMIN_AUTH_COOKIE_NAME, getAdminCookieOptions } from "../utils/authCookie.js";
import { signAdminToken, verifyAdminToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { changePasswordSchema, loginSchema } from "../schemas/auth.js";

const DEFAULT_TOKEN_TTL_SECONDS = 8 * 60 * 60;

function getTokenTtlSeconds(): number {
  const configured = Number(process.env.JWT_EXPIRES_IN_SECONDS);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_TOKEN_TTL_SECONDS;
}

function toPublicAdmin(admin: {
  id: number;
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  };
}

function unauthorized(res: Response) {
  res.clearCookie(ADMIN_AUTH_COOKIE_NAME, getAdminCookieOptions());
  res.status(401).json({ success: false, error: "You are not signed in." });
}

export const login = async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0];
    res.status(400).json({
      success: false,
      error: firstIssue?.message || "Email and password are required.",
      details: parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const admin = await prisma.adminUser.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }
    });
    const passwordValid = admin
      ? await verifyPassword(password, admin.passwordHash)
      : false;

    if (!admin || !passwordValid) {
      res.status(401).json({ success: false, error: "Invalid email or password." });
      return;
    }

    const ttlSeconds = getTokenTtlSeconds();
    const token = signAdminToken({ id: admin.id, role: admin.role }, ttlSeconds);

    res.cookie(ADMIN_AUTH_COOKIE_NAME, token, {
      ...getAdminCookieOptions(),
      maxAge: ttlSeconds * 1000
    });
    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, data: toPublicAdmin(admin) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Unable to sign in right now." });
  }
};

export const me = async (req: Request, res: Response) => {
  const token = req.cookies?.[ADMIN_AUTH_COOKIE_NAME];
  const payload = typeof token === "string" ? verifyAdminToken(token) : null;
  const adminId = payload ? Number(payload.sub) : NaN;

  if (!payload || !Number.isInteger(adminId) || adminId <= 0) {
    unauthorized(res);
    return;
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });

    if (!admin) {
      unauthorized(res);
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    res.json({ success: true, data: toPublicAdmin(admin) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Unable to load the current admin." });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(ADMIN_AUTH_COOKIE_NAME, getAdminCookieOptions());
  res.json({ success: true, data: { message: "Signed out." } });
};

export const changePassword = async (req: Request, res: Response) => {
  const adminId = req.admin?.id;

  if (!adminId || !Number.isInteger(adminId) || adminId <= 0) {
    res.status(401).json({ success: false, error: "You are not signed in." });
    return;
  }

  const parseResult = changePasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0];
    res.status(400).json({
      success: false,
      error: firstIssue?.message || "Invalid password update data.",
      details: parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  const { currentPassword, newPassword } = parseResult.data;

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      res.status(401).json({ success: false, error: "Admin account not found." });
      return;
    }

    const isValidCurrent = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isValidCurrent) {
      res.status(400).json({
        success: false,
        error: "The current password you entered is incorrect."
      });
      return;
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash }
    });

    res.json({
      success: true,
      data: { message: "Password updated successfully." }
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Unable to update password right now."
    });
  }
};
