/**
 * Jabour Phone - Store & Fulfillment Configuration (Moroccan Market)
 */
export const STORE_CONFIG = {
  storeName: "Jabour Phone",
  currency: "MAD",
  currencySymbol: "DH",
  standardShippingFee: 35.0,
  freeShippingThreshold: 300.0,
  supportPhone: "+212 5 22 12 34 56",
  supportWhatsapp: "+212 6 61 12 34 56",
  supportEmail: "orders@jabourphone.ma",
  adminNotificationEmail: "jabour@jabourphone.ma",
  defaultCity: "Casablanca",
  defaultCountry: "Morocco"
} as const;

/**
 * Calculates shipping fee given order subtotal.
 * Free delivery for orders meeting or exceeding the threshold (300 DH).
 */
export function calculateShippingFee(subtotal: number): number {
  if (subtotal >= STORE_CONFIG.freeShippingThreshold) {
    return 0;
  }
  return STORE_CONFIG.standardShippingFee;
}

/**
 * Computes subtotal, shipping fee, tax, and total amount.
 */
export function calculateOrderTotals(subtotal: number) {
  const shippingFee = calculateShippingFee(subtotal);
  const tax = 0;
  const totalAmount = Math.round((subtotal + shippingFee + tax) * 100) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shippingFee,
    tax,
    totalAmount
  };
}
