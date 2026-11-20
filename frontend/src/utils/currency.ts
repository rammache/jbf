/**
 * Currency formatting utility for Jabour Phone.
 * Formats prices cleanly in Moroccan Dirham (MAD / DH / د.م.) and supports international currencies.
 */
export function formatPrice(
  amount: number | string | null | undefined,
  symbol = "DH",
  lang: "fr" | "ar" | "en" = "fr"
): string {
  const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
  const safeNum = Number.isFinite(num) ? num : 0;

  // Resolve localized symbol if requested or defaulted
  const activeSymbol = symbol === "DH" && lang === "ar" ? "د.م." : symbol;

  const formattedNumber = safeNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // If symbol is multi-character or Arabic Dirham or DH/MAD, format as suffix: "1,299.00 DH" or "1,299.00 د.م."
  const isSuffix =
    activeSymbol === "DH" ||
    activeSymbol === "MAD" ||
    activeSymbol === "د.م." ||
    activeSymbol === "L.L." ||
    activeSymbol.trim().length > 1;

  if (isSuffix) {
    return `${formattedNumber} ${activeSymbol.trim()}`;
  }

  // Single-character symbols like $, €, £ format as prefix: "$120.00"
  return `${activeSymbol}${formattedNumber}`;
}
