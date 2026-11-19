/**
 * Jabour Phone - Store & Fulfillment Configuration
 */
export const STORE_CONFIG = {
  storeName: "Jabour Phone",
  currency: "USD",
  currencySymbol: "$",
  standardShippingFee: 5.0,
  freeShippingThreshold: 50.0,
  supportPhone: "+961 70 123 456",
  supportEmail: "orders@jabourphone.com",
  adminNotificationEmail: "jabour@jabourphone.com",
  defaultCity: "Beirut"
} as const;

/**
 * Calculates shipping fee given order subtotal.
 * Free delivery for orders meeting or exceeding the threshold ($50).
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
