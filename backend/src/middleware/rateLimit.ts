import { rateLimit, type Options } from "express-rate-limit";
import type { Request, Response, NextFunction, RequestHandler } from "express";

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
    handler: ((req: any, res: any, _next: any, options: any) => {
      const minutes = Math.ceil(options.windowMs / (60 * 1000));
      const message =
        minutes > 1
          ? `Too many login attempts. Please try again after ${minutes} minutes.`
          : `Too many login attempts. Please try again after 1 minute.`;

      res.status(options.statusCode).json({
        success: false,
        error: message
      });
    }) as any,
    ...overrides
  }) as unknown as RequestHandler;
}

export const loginRateLimiter = createLoginRateLimiter();

/**
 * Rate limiter for checkout order placement (prevent abuse/spam)
 * Default: 10 order attempts per 15 minutes per IP.
 */
export function createOrderRateLimiter(overrides?: Partial<Options>): RequestHandler {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: ((_req: any, res: any, _next: any, options: any) => {
      res.status(options.statusCode).json({
        success: false,
        error: "Too many order requests from your network. Please wait a few minutes before trying again."
      });
    }) as any,
    ...overrides
  }) as unknown as RequestHandler;
}

export const orderRateLimiter = createOrderRateLimiter();

/**
 * Rate limiter for newsletter subscription
 * Default: 5 attempts per 15 minutes per IP.
 */
export function createNewsletterRateLimiter(overrides?: Partial<Options>): RequestHandler {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: ((_req: any, res: any, _next: any, options: any) => {
      res.status(options.statusCode).json({
        success: false,
        error: "Too many newsletter subscription attempts. Please try again later."
      });
    }) as any,
    ...overrides
  }) as unknown as RequestHandler;
}

export const newsletterRateLimiter = createNewsletterRateLimiter();
