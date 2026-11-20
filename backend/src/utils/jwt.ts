import jwt, { JwtPayload } from "jsonwebtoken";

export interface AdminTokenPayload extends JwtPayload {
  sub: string;
  role: string;
}

const FALLBACK_SECRET = "1b698de3af3720eb7d0c82989c734a17a9f07640633faa8f2bd482ba6701cfc4";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      throw new Error(
        "JWT_SECRET is not set. Add it to backend/.env (see backend/.env.example)."
      );
    }
    console.warn("⚠️ Warning: JWT_SECRET environment variable is missing. Using safe fallback.");
    return FALLBACK_SECRET;
  }

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    if (secret.includes("CHANGE_ME") || secret.length < 32) {
      throw new Error(
        "FATAL: Insecure JWT_SECRET detected in production. JWT_SECRET must be at least 32 characters long and not contain placeholder strings."
      );
    }
  }

  return secret;
}

export function signAdminToken(
  admin: { id: number; role: string },
  expiresInSeconds: number
): string {
  return jwt.sign({ role: admin.role }, getJwtSecret(), {
    subject: String(admin.id),
    expiresIn: expiresInSeconds
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string" || !decoded.sub) {
      return null;
    }
    return decoded as AdminTokenPayload;
  } catch {
    return null;
  }
}
