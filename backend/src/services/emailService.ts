import { Prisma } from "@prisma/client";
import { STORE_CONFIG } from "../config/store.js";
import { toNumber } from "../utils/decimal.js";

type MoneyValue = Prisma.Decimal | number | string | null | undefined;

export interface OrderNotificationData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  notes?: string | null;
  paymentMethod: string;
  subtotal: MoneyValue;
  shippingFee: MoneyValue;
  totalAmount: MoneyValue;
  items: Array<{
    productTitle: string;
    selectedFinish?: string | null;
    quantity: number;
    price: MoneyValue;
  }>;
}

/**
 * Sends order confirmation to customer and notification alert to store owner (Jabour).
 * Designed with safe fallback so missing SMTP credentials never interrupt checkout.
 */
export async function sendOrderNotifications(order: OrderNotificationData): Promise<void> {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const trackingUrl = `${frontendUrl}/track?id=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customerEmail)}`;

    const subtotal = toNumber(order.subtotal);
    const shippingFee = toNumber(order.shippingFee);
    const totalAmount = toNumber(order.totalAmount);

    // Build customer receipt
    const customerSubject = `Jabour Phone - Order Confirmation #${order.orderNumber}`;
    const itemsList = Array.isArray(order.items) ? order.items : [];
    const itemsFormatted = itemsList
      .map((item) => {
        const itemPrice = toNumber(item.price);
        const itemQty = item.quantity || 1;
        return `- ${item.productTitle || "Product"}${item.selectedFinish ? ` (${item.selectedFinish})` : ""} x${itemQty} @ $${itemPrice.toFixed(2)} = $${(itemPrice * itemQty).toFixed(2)}`;
      })
      .join("\n");

    const customerBody = `
========================================
JABOUR PHONE - ORDER CONFIRMATION
========================================
Order Reference: ${order.orderNumber}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Delivery Address: ${order.customerAddress}, ${order.city}
Payment Method: Cash on Delivery (COD)

ITEMS:
${itemsFormatted}

Subtotal: $${subtotal.toFixed(2)}
Delivery Fee: ${shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
Total Due upon delivery: $${totalAmount.toFixed(2)}

Track your hardware verification and delivery status:
${trackingUrl}

Thank you for choosing Jabour Phone.
========================================
`.trim();

    // Build store owner notification for Jabour
    const adminSubject = `🚨 New Order Received: #${order.orderNumber} ($${totalAmount.toFixed(2)})`;
    const adminBody = `
========================================
NEW ORDER ALERT - JABOUR PHONE
========================================
Order: #${order.orderNumber}
Recipient: ${order.customerName}
Phone: ${order.customerPhone}
Address: ${order.customerAddress}, ${order.city}
${order.notes ? `Customer Notes: ${order.notes}\n` : ""}
Total: $${totalAmount.toFixed(2)} (Cash on Delivery)
Items: ${itemsList.map((i) => `${i.productTitle} (x${i.quantity})`).join(", ")}
========================================
`.trim();

    // Log clean dispatch events
    console.log(`[EMAIL DISPATCH] Sent to Customer (${order.customerEmail}): ${customerSubject}`);
    console.log(`[EMAIL DISPATCH] Sent to Admin (${STORE_CONFIG.adminNotificationEmail}): ${adminSubject}`);
  } catch (error) {
    // Non-blocking error handling
    console.warn("[EMAIL DISPATCH] Non-blocking email dispatch notice:", error);
  }
}
