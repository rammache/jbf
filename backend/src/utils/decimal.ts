import { Prisma } from "@prisma/client";

/**
 * Utility functions for precise Decimal currency handling
 */

/**
 * Converts any Decimal, number, or string value safely to a JavaScript number.
 */
export function toNumber(value: Prisma.Decimal | number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number") return isNaN(value) ? fallback : value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  if (value instanceof Prisma.Decimal || (typeof value === "object" && "toNumber" in value)) {
    return (value as Prisma.Decimal).toNumber();
  }
  return fallback;
}

/**
 * Converts a number or string to a Prisma.Decimal instance with 2 decimal places.
 */
export function toDecimal(value: number | string | Prisma.Decimal): Prisma.Decimal {
  if (value instanceof Prisma.Decimal) return value;
  const num = typeof value === "string" ? parseFloat(value) : value;
  const rounded = Math.round(num * 100) / 100;
  return new Prisma.Decimal(rounded.toFixed(2));
}

/**
 * Formats a Decimal, number or string to standard 2-decimal string representation (e.g., "49.99").
 */
export function formatDecimal(value: Prisma.Decimal | number | string | null | undefined): string {
  return toNumber(value).toFixed(2);
}
