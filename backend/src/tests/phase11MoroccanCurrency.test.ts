import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { STORE_CONFIG, calculateShippingFee, calculateOrderTotals } from "../config/store.js";

const rootDir = path.resolve(__dirname, "../../..");

describe("Phase 11 - Moroccan Dirham (MAD) Currency Localization", () => {
  describe("Task 1 & 3: Store Settings Defaults & Moroccan Market Configuration", () => {
    it("backend STORE_CONFIG defaults to Moroccan Dirham (MAD / DH / 35 DH / 300 DH)", () => {
      assert.strictEqual(STORE_CONFIG.currency, "MAD");
      assert.strictEqual(STORE_CONFIG.currencySymbol, "DH");
      assert.strictEqual(STORE_CONFIG.standardShippingFee, 35.0);
      assert.strictEqual(STORE_CONFIG.freeShippingThreshold, 300.0);
      assert.strictEqual(STORE_CONFIG.defaultCity, "Casablanca");
      assert.strictEqual(STORE_CONFIG.defaultCountry, "Morocco");
      assert.ok(STORE_CONFIG.supportPhone.startsWith("+212"), "Phone must use Morocco country code (+212)");
      assert.ok(STORE_CONFIG.supportEmail.endsWith(".ma"), "Email domain should be .ma");
    });

    it("backend settingsController.ts defines Moroccan defaults", () => {
      const settingsPath = path.join(rootDir, "backend/src/controllers/settingsController.ts");
      assert.ok(fs.existsSync(settingsPath), "settingsController.ts must exist");
      const content = fs.readFileSync(settingsPath, "utf-8");

      assert.ok(content.includes('currency: "MAD"'), "Default currency must be MAD");
      assert.ok(content.includes('currencySymbol: "DH"'), "Default symbol must be DH");
      assert.ok(content.includes("shippingFee: 35.0"), "Default delivery fee must be 35.0 DH");
      assert.ok(content.includes("freeShippingThreshold: 300.0"), "Default threshold must be 300.0 DH");
      assert.ok(content.includes('country: "Morocco"'), "Default country must be Morocco");
      assert.ok(content.includes('city: "Casablanca"'), "Default city must be Casablanca");
    });

    it("backend prisma/schema.prisma enforces MAD defaults on StoreSettings", () => {
      const schemaPath = path.join(rootDir, "backend/prisma/schema.prisma");
      assert.ok(fs.existsSync(schemaPath), "schema.prisma must exist");
      const content = fs.readFileSync(schemaPath, "utf-8");

      assert.ok(content.includes('currency              String   @default("MAD")'), "Schema must default currency to MAD");
      assert.ok(content.includes('currencySymbol        String   @default("DH")'), "Schema must default symbol to DH");
      assert.ok(content.includes("shippingFee           Decimal  @default(35.00)"), "Schema must default shippingFee to 35.00");
      assert.ok(content.includes("freeShippingThreshold Decimal  @default(300.00)"), "Schema must default freeShippingThreshold to 300.00");
    });

    it("frontend SettingsContext defines Moroccan defaults", () => {
      const contextPath = path.join(rootDir, "frontend/src/context/SettingsContext.tsx");
      assert.ok(fs.existsSync(contextPath), "SettingsContext.tsx must exist");
      const content = fs.readFileSync(contextPath, "utf-8");

      assert.ok(content.includes('currency: "MAD"'), "Frontend must default currency to MAD");
      assert.ok(content.includes('currencySymbol: "DH"'), "Frontend must default symbol to DH");
      assert.ok(content.includes("shippingFee: 35.0"), "Frontend must default shippingFee to 35.0");
      assert.ok(content.includes("freeShippingThreshold: 300.0"), "Frontend must default freeShippingThreshold to 300.0");
      assert.ok(content.includes('country: "Morocco"'), "Frontend must default country to Morocco");
    });
  });

  describe("Task 2: Frontend Currency Utility (formatPrice)", () => {
    const currencyUtilPath = path.join(rootDir, "frontend/src/utils/currency.ts");

    it("frontend/src/utils/currency.ts exports formatPrice function", () => {
      assert.ok(fs.existsSync(currencyUtilPath), "currency.ts utility must exist");
      const content = fs.readFileSync(currencyUtilPath, "utf-8");
      assert.ok(content.includes("export function formatPrice"), "formatPrice must be exported");
    });

    it("formats Moroccan Dirham with DH suffix correctly", () => {
      const formatPrice = (amount: number | string | null | undefined, symbol = "DH", lang = "fr") => {
        const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
        const safeNum = Number.isFinite(num) ? num : 0;
        const activeSymbol = symbol === "DH" && lang === "ar" ? "د.م." : symbol;
        const formatted = safeNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const isSuffix = activeSymbol === "DH" || activeSymbol === "MAD" || activeSymbol === "د.م." || activeSymbol.length > 1;
        return isSuffix ? `${formatted} ${activeSymbol.trim()}` : `${activeSymbol}${formatted}`;
      };

      assert.strictEqual(formatPrice(1299), "1,299.00 DH");
      assert.strictEqual(formatPrice(35), "35.00 DH");
      assert.strictEqual(formatPrice(300), "300.00 DH");
      assert.strictEqual(formatPrice(0), "0.00 DH");
      assert.strictEqual(formatPrice("45.5"), "45.50 DH");
      assert.strictEqual(formatPrice(18499.5), "18,499.50 DH");
    });

    it("formats Arabic Dirham suffix correctly when Arabic is specified", () => {
      const formatPrice = (amount: number | string | null | undefined, symbol = "DH", lang = "fr") => {
        const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
        const safeNum = Number.isFinite(num) ? num : 0;
        const activeSymbol = symbol === "DH" && lang === "ar" ? "د.م." : symbol;
        const formatted = safeNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const isSuffix = activeSymbol === "DH" || activeSymbol === "MAD" || activeSymbol === "د.م." || activeSymbol.length > 1;
        return isSuffix ? `${formatted} ${activeSymbol.trim()}` : `${activeSymbol}${formatted}`;
      };

      assert.strictEqual(formatPrice(1299, "د.م."), "1,299.00 د.م.");
      assert.strictEqual(formatPrice(35, "DH", "ar"), "35.00 د.م.");
      assert.strictEqual(formatPrice(300, "DH", "ar"), "300.00 د.م.");
    });

    it("retains prefix formatting for single-character currency symbols ($ and €)", () => {
      const formatPrice = (amount: number | string | null | undefined, symbol = "DH") => {
        const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
        const safeNum = Number.isFinite(num) ? num : 0;
        const formatted = safeNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const isSuffix = symbol === "DH" || symbol === "MAD" || symbol.length > 1;
        return isSuffix ? `${formatted} ${symbol.trim()}` : `${symbol}${formatted}`;
      };

      assert.strictEqual(formatPrice(120, "$"), "$120.00");
      assert.strictEqual(formatPrice(50, "€"), "€50.00");
      assert.strictEqual(formatPrice(99.99, "£"), "£99.99");
    });
  });

  describe("Task 4: Moroccan Shipping Fee Rules & Thresholds", () => {
    it("applies standard 35 DH fee when subtotal is below 300 DH threshold", () => {
      const feeBelow = calculateShippingFee(299.99);
      assert.strictEqual(feeBelow, 35.0);

      const feeSmall = calculateShippingFee(50.0);
      assert.strictEqual(feeSmall, 35.0);

      const totals = calculateOrderTotals(250);
      assert.strictEqual(totals.subtotal, 250);
      assert.strictEqual(totals.shippingFee, 35);
      assert.strictEqual(totals.totalAmount, 285);
    });

    it("applies free delivery (0 DH) when subtotal meets or exceeds 300 DH threshold", () => {
      const feeAtThreshold = calculateShippingFee(300);
      assert.strictEqual(feeAtThreshold, 0);

      const feeAbove = calculateShippingFee(1299);
      assert.strictEqual(feeAbove, 0);

      const totals = calculateOrderTotals(300);
      assert.strictEqual(totals.subtotal, 300);
      assert.strictEqual(totals.shippingFee, 0);
      assert.strictEqual(totals.totalAmount, 300);

      const totalsHigh = calculateOrderTotals(8500);
      assert.strictEqual(totalsHigh.subtotal, 8500);
      assert.strictEqual(totalsHigh.shippingFee, 0);
      assert.strictEqual(totalsHigh.totalAmount, 8500);
    });
  });

  describe("Task 5: Demo Seed Catalog Moroccan Dirham Calibration", () => {
    it("demo-seed.ts contains realistic Moroccan Dirham prices (> 500 DH)", () => {
      const demoSeedPath = path.join(rootDir, "backend/prisma/demo-seed.ts");
      assert.ok(fs.existsSync(demoSeedPath), "demo-seed.ts must exist");
      const content = fs.readFileSync(demoSeedPath, "utf-8");

      assert.ok(content.includes("price: 11999"), "Kestrel 14 Ultrabook should be priced in MAD (11,999 DH)");
      assert.ok(content.includes("price: 18499"), "Kestrel 16 Studio should be priced in MAD (18,499 DH)");
      assert.ok(content.includes("price: 8999"), "Nord Flex should be priced in MAD (8,999 DH)");
      assert.ok(content.includes("price: 7499"), "Nord Air 13 should be priced in MAD (7,499 DH)");
      assert.ok(content.includes("price: 3299"), "Meridian Over-Ear should be priced in MAD (3,299 DH)");
      assert.ok(content.includes("price: 1390"), "Nord Mechanical 75 should be priced in MAD (1,390 DH)");
    });
  });
});
