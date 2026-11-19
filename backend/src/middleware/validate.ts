import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues;
      const firstIssue = issues[0];
      const errorMessage = firstIssue?.message || "Invalid request payload.";

      res.status(400).json({
        success: false,
        error: errorMessage,
        code: "VALIDATION_ERROR",
        details: issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const issues = result.error.issues;
      const firstIssue = issues[0];
      const errorMessage = firstIssue?.message || "Invalid query parameters.";

      res.status(400).json({
        success: false,
        error: errorMessage,
        code: "VALIDATION_ERROR",
        details: issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
      return;
    }

    // Assign validated and coerced query
    (req as Request & { validatedQuery: T }).validatedQuery = result.data;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const issues = result.error.issues;
      const firstIssue = issues[0];
      const errorMessage = firstIssue?.message || "Invalid route parameters.";

      res.status(400).json({
        success: false,
        error: errorMessage,
        code: "VALIDATION_ERROR",
        details: issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
      return;
    }

    next();
  };
}
