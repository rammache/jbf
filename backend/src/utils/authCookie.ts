import { CookieOptions } from "express";

export const ADMIN_AUTH_COOKIE_NAME = "jabour_admin_token";

export function getAdminCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  };
}
