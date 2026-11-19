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
