import { CookieOptions } from "express";

export const ADMIN_AUTH_COOKIE_NAME = "jabour_admin_token";

export function getAdminCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  const explicitSameSite = process.env.COOKIE_SAMESITE?.toLowerCase();

  // In split-domain setups (e.g. Vercel frontend on *.vercel.app and backend on *.up.railway.app / *.onrender.com),
  // cookies must be sameSite: "none" and secure: true so browsers send them in cross-origin fetch requests.
  const sameSite: "lax" | "none" | "strict" =
    explicitSameSite === "none" || explicitSameSite === "lax" || explicitSameSite === "strict"
      ? (explicitSameSite as "lax" | "none" | "strict")
      : isProd && process.env.FRONTEND_URL?.includes("://") && process.env.SERVE_FRONTEND !== "true"
        ? "none"
        : "lax";

  return {
    httpOnly: true,
    secure: sameSite === "none" ? true : isProd,
    sameSite,
    path: "/"
  };
}
