import { describe, it } from "node:test";
import assert from "node:assert";

interface CartItemTest {
  key: string;
  productId: number;
  handle: string;
  title: string;
  price: number;
  selectedFinish: string;
  quantity: number;
}

function calculateCartTotals(
  items: CartItemTest[],
  shippingConfig = { fee: 5.0, threshold: 50.0 },
  coupon?: { type: "PERCENTAGE" | "FIXED"; value: number; maxDiscount?: number | null }
) {
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  const shippingFee = subtotal >= shippingConfig.threshold || subtotal === 0 ? 0 : shippingConfig.fee;
  const grandTotal = Math.max(0, Math.round((subtotal - discount + shippingFee) * 100) / 100);

  return {
    count,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    shippingFee,
    grandTotal
  };
}

function validateCheckoutForm(data: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  cartItemsCount: number;
}) {
  const errors: Record<string, string> = {};

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.customerName = "Full name must be at least 2 characters";
  }

  const phoneClean = data.customerPhone.replace(/[^0-9]/g, "");
  if (!phoneClean || phoneClean.length < 6) {
    errors.customerPhone = "Please provide a valid phone number for courier delivery";
  }

  if (!data.customerAddress || data.customerAddress.trim().length < 3) {
    errors.customerAddress = "Street address is required for delivery";
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = "City is required";
  }

  if (data.cartItemsCount <= 0) {
    errors.cart = "Cart cannot be empty";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

describe("Frontend Cart and Checkout Test Suite", () => {
  describe("Cart Calculations & Operations", () => {
    it("calculates cart count and subtotal correctly", () => {
      const items: CartItemTest[] = [
        { key: "iphone-15|Black", productId: 1, handle: "iphone-15", title: "iPhone 15", price: 799, selectedFinish: "Black", quantity: 2 },
        { key: "case-silicone|Clear", productId: 2, handle: "case-silicone", title: "Silicone Case", price: 25, selectedFinish: "Clear", quantity: 1 }
      ];

      const totals = calculateCartTotals(items);
      assert.strictEqual(totals.count, 3);
      assert.strictEqual(totals.subtotal, 1623); // (799 * 2) + 25
      assert.strictEqual(totals.shippingFee, 0); // > 50 threshold -> free
      assert.strictEqual(totals.grandTotal, 1623);
    });

    it("applies standard $5 shipping fee when subtotal is under $50 threshold", () => {
      const items: CartItemTest[] = [
        { key: "usb-cable|White", productId: 3, handle: "usb-cable", title: "USB-C Cable", price: 15, selectedFinish: "White", quantity: 2 }
      ];

      const totals = calculateCartTotals(items);
      assert.strictEqual(totals.subtotal, 30);
      assert.strictEqual(totals.shippingFee, 5);
      assert.strictEqual(totals.grandTotal, 35);
    });

    it("calculates percentage discount with maxDiscount cap", () => {
      const items: CartItemTest[] = [
        { key: "samsung-s24|Gray", productId: 4, handle: "samsung-s24", title: "Galaxy S24", price: 900, selectedFinish: "Gray", quantity: 1 }
      ];

      // 10% off $900 capped at $50
      const totals = calculateCartTotals(items, { fee: 5, threshold: 50 }, {
        type: "PERCENTAGE",
        value: 10,
        maxDiscount: 50
      });

      assert.strictEqual(totals.discount, 50); // Capped at $50 instead of $90
      assert.strictEqual(totals.grandTotal, 850);
    });

    it("calculates fixed discount without exceeding subtotal", () => {
      const items: CartItemTest[] = [
        { key: "adapter|White", productId: 5, handle: "adapter", title: "Fast Charger", price: 20, selectedFinish: "White", quantity: 1 }
      ];

      // $30 fixed discount on $20 item
      const totals = calculateCartTotals(items, { fee: 5, threshold: 50 }, {
        type: "FIXED",
        value: 30
      });

      assert.strictEqual(totals.discount, 20); // Cannot exceed subtotal
      assert.strictEqual(totals.grandTotal, 5); // $0 subtotal remainder + $5 shipping
    });
  });

  describe("Checkout Form Validation", () => {
    it("validates successful checkout submission with required fields", () => {
      const valid = {
        customerName: "Jabour Khalil",
        customerPhone: "+961 70 123 456",
        customerAddress: "Hamra Main Street, Bldg 22",
        city: "Beirut",
        cartItemsCount: 2
      };

      const result = validateCheckoutForm(valid);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(Object.keys(result.errors).length, 0);
    });

    it("rejects checkout submission when phone number is missing or invalid", () => {
      const invalid = {
        customerName: "Jabour Khalil",
        customerPhone: "123", // too short
        customerAddress: "Hamra Main Street",
        city: "Beirut",
        cartItemsCount: 1
      };

      const result = validateCheckoutForm(invalid);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.customerPhone);
    });

    it("blocks checkout submission when cart is empty", () => {
      const empty = {
        customerName: "Jabour Khalil",
        customerPhone: "+961 70 123 456",
        customerAddress: "Hamra Main Street",
        city: "Beirut",
        cartItemsCount: 0
      };

      const result = validateCheckoutForm(empty);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.cart);
    });
  });
});
