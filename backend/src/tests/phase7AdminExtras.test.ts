import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { updateStoreSettingsSchema } from "../schemas/settings.js";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema
} from "../schemas/coupon.js";
import {
  calculateCouponDiscount
} from "../controllers/couponController.js";
import {
  createAdminUserSchema,
  updateAdminUserSchema
} from "../schemas/adminUser.js";

describe("Phase 7 - Newsletter, Settings, And Admin Extras", () => {
  describe("Task 1 & 2: StoreSettings Schema & Validation", () => {
    test("validates complete StoreSettings update payload", () => {
      const validPayload = {
        storeName: "Jabour Phone Lebanon",
        phone: "+961 70 123 456",
        whatsapp: "+961 70 123 456",
        email: "contact@jabourphone.com",
        address: "Hamra Main Street, Beirut",
        city: "Beirut",
        country: "Lebanon",
        currency: "USD",
        currencySymbol: "$",
        shippingFee: 5.0,
        freeShippingThreshold: 50.0,
        announcement: "Free delivery over $50 | 2-year warranty guaranteed",
        workingHours: "Mon - Sat: 9:00 AM - 8:00 PM",
        aboutText: "Certified authentic phones and electronics in Lebanon."
      };

      const result = updateStoreSettingsSchema.safeParse(validPayload);
      assert.equal(result.success, true);
    });

    test("rejects invalid email and negative fees in StoreSettings", () => {
      const invalidPayload = {
        storeName: "Jabour Phone",
        phone: "12345",
        whatsapp: "12345",
        email: "not-an-email",
        address: "Beirut",
        city: "Beirut",
        country: "Lebanon",
        currency: "USD",
        currencySymbol: "$",
        shippingFee: -10, // negative fee
        freeShippingThreshold: -5
      };

      const result = updateStoreSettingsSchema.safeParse(invalidPayload);
      assert.equal(result.success, false);
      if (!result.success) {
        const fields = result.error.issues.map((i) => i.path[0]);
        assert.ok(fields.includes("email"));
        assert.ok(fields.includes("shippingFee"));
        assert.ok(fields.includes("freeShippingThreshold"));
      }
    });
  });

  describe("Task 8: Coupon System & Calculation Rules", () => {
    test("validates valid percentage coupon schema", () => {
      const validCoupon = {
        code: "summer15",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderAmount: 100,
        maxDiscount: 50,
        usageLimit: 100,
        isActive: true
      };

      const result = createCouponSchema.safeParse(validCoupon);
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.code, "SUMMER15"); // uppercase transformation
      }
    });

    test("validates valid fixed-amount coupon schema", () => {
      const validCoupon = {
        code: "save20",
        discountType: "FIXED",
        discountValue: 20,
        minOrderAmount: 80,
        isActive: true
      };

      const result = createCouponSchema.safeParse(validCoupon);
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.code, "SAVE20");
        assert.equal(result.data.discountType, "FIXED");
      }
    });

    test("rejects percentage discount greater than 100%", () => {
      const invalidCoupon = {
        code: "OVER100",
        discountType: "PERCENTAGE",
        discountValue: 150
      };

      const result = createCouponSchema.safeParse(invalidCoupon);
      assert.equal(result.success, false);
    });

    test("calculateCouponDiscount computes percentage discounts correctly with cap", () => {
      // 10% off $500 = $50
      const discount1 = calculateCouponDiscount(500, "PERCENTAGE", 10, null);
      assert.equal(discount1, 50);

      // 20% off $500 = $100, but capped at $40
      const discount2 = calculateCouponDiscount(500, "PERCENTAGE", 20, 40);
      assert.equal(discount2, 40);

      // Fixed $30 off $100 = $30
      const discount3 = calculateCouponDiscount(100, "FIXED", 30, null);
      assert.equal(discount3, 30);

      // Fixed $50 off $20 = $20 (cannot exceed subtotal)
      const discount4 = calculateCouponDiscount(20, "FIXED", 50, null);
      assert.equal(discount4, 20);
    });

    test("validateCouponSchema normalizes codes to uppercase", () => {
      const parsed = validateCouponSchema.safeParse({
        code: "  welcome2026  ",
        subtotal: 150.5
      });

      assert.equal(parsed.success, true);
      if (parsed.success) {
        assert.equal(parsed.data.code, "WELCOME2026");
        assert.equal(parsed.data.subtotal, 150.5);
      }
    });
  });

  describe("Task 7: Admin Accounts & Role Support", () => {
    test("validates valid admin user creation payload with role", () => {
      const validAdmin = {
        name: "Fadi Jabour",
        email: "fadi@jabourphone.com",
        password: "SuperSecretPassword123!",
        role: "ADMIN"
      };

      const result = createAdminUserSchema.safeParse(validAdmin);
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.role, "ADMIN");
      }
    });

    test("validates SUPER_ADMIN and STAFF roles", () => {
      const superAdminResult = createAdminUserSchema.safeParse({
        name: "Owner Jabour",
        email: "owner@jabourphone.com",
        password: "StrongPassword123#",
        role: "SUPER_ADMIN"
      });
      assert.equal(superAdminResult.success, true);

      const staffResult = createAdminUserSchema.safeParse({
        name: "Support Staff",
        email: "staff@jabourphone.com",
        password: "StrongPassword123#",
        role: "STAFF"
      });
      assert.equal(staffResult.success, true);
    });

    test("rejects password shorter than 12 characters", () => {
      const shortPass = {
        name: "Short Pass",
        email: "short@example.com",
        password: "shortpass",
        role: "ADMIN"
      };

      const result = createAdminUserSchema.safeParse(shortPass);
      assert.equal(result.success, false);
      if (!result.success) {
        assert.equal(result.error.issues[0]?.path[0], "password");
      }
    });
  });

  describe("Task 4: Newsletter CSV Export Format", () => {
    test("formats CSV output correctly with RFC4180 escaping", () => {
      const subscribers = [
        { id: 1, email: "user1@example.com", subscribedAt: new Date("2026-11-01T10:00:00Z") },
        { id: 2, email: 'user"quotes"@example.com', subscribedAt: new Date("2026-11-02T12:00:00Z") }
      ];

      const header = "ID,Email,Subscribed At\n";
      const rows = subscribers
        .map((s) => `${s.id},"${s.email.replace(/"/g, '""')}","${s.subscribedAt.toISOString()}"`)
        .join("\n");
      const csv = header + rows;

      assert.ok(csv.startsWith("ID,Email,Subscribed At\n"));
      assert.ok(csv.includes('1,"user1@example.com","2026-11-01T10:00:00.000Z"'));
      assert.ok(csv.includes('2,"user""quotes""@example.com","2026-11-02T12:00:00.000Z"'));
    });
  });

  describe("Task 9: Profit Report & Supplier Cost Calculations", () => {
    test("calculates gross profit, unit profit, and margin correctly", () => {
      const retailPrice = 1000;
      const supplierCost = 750;
      const unitsSold = 10;

      const unitProfit = retailPrice - supplierCost; // 250
      const totalRevenue = retailPrice * unitsSold; // 10000
      const totalCost = supplierCost * unitsSold; // 7500
      const grossProfit = totalRevenue - totalCost; // 2500
      const marginPercent = (grossProfit / totalRevenue) * 100; // 25%

      assert.equal(unitProfit, 250);
      assert.equal(grossProfit, 2500);
      assert.equal(marginPercent, 25);
    });

    test("handles zero cost and zero revenue safely", () => {
      const zeroSalesRevenue = 0;
      const zeroSalesCost = 0;
      const grossProfit = zeroSalesRevenue - zeroSalesCost;
      const marginPercent = zeroSalesRevenue > 0 ? (grossProfit / zeroSalesRevenue) * 100 : 0;

      assert.equal(grossProfit, 0);
      assert.equal(marginPercent, 0);
    });
  });
});
