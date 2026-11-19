/**
 * Currency formatting utility for Jabour Phone.
 * Ensures consistent currency display with dynamic currency symbol.
 */
export function formatPrice(amount: number | string | null | undefined, symbol = "$"): string {
  const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
  const safeNum = Number.isFinite(num) ? num : 0;
  return `${symbol}${safeNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
