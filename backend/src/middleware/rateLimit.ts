import { rateLimit, type Options } from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

export const DEFAULT_LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const DEFAULT_LOGIN_RATE_LIMIT_MAX = 5; // 5 attempts per window

export interface LoginRateLimitConfig {
  windowMs: number;
  limit: number;
  skipSuccessfulRequests: boolean;
}

export function getLoginRateLimitConfig(): LoginRateLimitConfig {
  const windowMsRaw = process.env.LOGIN_RATE_LIMIT_WINDOW_MS;
  const maxRaw = process.env.LOGIN_RATE_LIMIT_MAX;
  const skipSuccessfulRaw = process.env.LOGIN_RATE_LIMIT_SKIP_SUCCESSFUL;

  const windowMs = Number(windowMsRaw);
  const max = Number(maxRaw);

  return {
    windowMs:
      Number.isFinite(windowMs) && windowMs > 0
        ? windowMs
        : DEFAULT_LOGIN_RATE_LIMIT_WINDOW_MS,
    limit:
      Number.isFinite(max) && max > 0
        ? max
        : DEFAULT_LOGIN_RATE_LIMIT_MAX,
    skipSuccessfulRequests:
      skipSuccessfulRaw !== undefined
        ? skipSuccessfulRaw.toLowerCase() === "true"
        : true
  };
}

export function createLoginRateLimiter(overrides?: Partial<Options>) {
  const config = getLoginRateLimitConfig();
  const windowMs = overrides?.windowMs ?? config.windowMs;
  const limit = overrides?.limit ?? config.limit;
  const skipSuccessfulRequests =
    overrides?.skipSuccessfulRequests ?? config.skipSuccessfulRequests;

  return rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req: Request, res: Response, _next: NextFunction, options) => {
      const minutes = Math.ceil(options.windowMs / (60 * 1000));
      const message =
        minutes > 1
          ? `Too many login attempts. Please try again after ${minutes} minutes.`
          : `Too many login attempts. Please try again after 1 minute.`;

      res.status(options.statusCode).json({
        success: false,
        error: message
      });
    },
    ...overrides
  });
}

export const loginRateLimiter = createLoginRateLimiter();
