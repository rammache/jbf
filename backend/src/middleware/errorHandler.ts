import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Standard Application Error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: unknown) {
    super(message, 409, "CONFLICT", details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation error", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

/**
 * Central Error Handling Middleware
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // If response is already committed, pass through
  if (res.headersSent) {
    return;
  }

  // Operational AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {})
    });
    return;
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const message = firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Validation failed";
    res.status(400).json({
      success: false,
      error: message,
      code: "VALIDATION_ERROR",
      details: err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message
      }))
    });
    return;
  }

  // Malformed JSON syntax error in request body
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      error: "Malformed JSON payload provided.",
      code: "INVALID_JSON"
    });
    return;
  }

  // Prisma Client Known Request Errors
  if (typeof err === "object" && err !== null && "code" in err) {
    const prismaErr = err as { code: string; meta?: Record<string, unknown>; message?: string };
    if (prismaErr.code === "P2002") {
      res.status(409).json({
        success: false,
        error: "A record with this unique value already exists.",
        code: "UNIQUE_CONSTRAINT_VIOLATION",
        details: prismaErr.meta
      });
      return;
    }
    if (prismaErr.code === "P2025") {
      res.status(404).json({
        success: false,
        error: "The requested record was not found.",
        code: "NOT_FOUND"
      });
      return;
    }
  }

  // Unknown / Unexpected internal error
  const isDev = process.env.NODE_ENV !== "production";
  const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
  
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Unhandled Error] ${req.method} ${req.url}:`, err);
  }

  res.status(500).json({
    success: false,
    error: isDev ? errorMessage : "An unexpected error occurred. Please try again later.",
    code: "INTERNAL_SERVER_ERROR"
  });
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
    code: "ROUTE_NOT_FOUND"
  });
}
