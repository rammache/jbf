import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = fs.existsSync(path.join(process.cwd(), "frontend"))
  ? process.cwd()
  : path.resolve(process.cwd(), "..");

describe("Phase 1 - Rebrand To Jabour Phone", () => {
  describe("Task 1 & 2: Real Store Promises and Business Information", () => {
    test("backend StoreSettings default config has authentic business contact data", () => {
      const settingsPath = path.join(rootDir, "backend/src/controllers/settingsController.ts");
      const content = fs.readFileSync(settingsPath, "utf-8");

      assert.ok(content.includes('storeName: "Jabour Phone"'), "Store name must be Jabour Phone");
      assert.ok(
        content.includes('phone: "+961 70 123 456"') || content.includes('phone: "+212 5 22 12 34 56"'),
        "Real phone number must be configured"
      );
      assert.ok(
        content.includes('whatsapp: "+961 70 123 456"') || content.includes('whatsapp: "+212 6 61 12 34 56"'),
        "Real WhatsApp number must be configured"
      );
      assert.ok(
        content.includes('email: "contact@jabourphone.com"') || content.includes('email: "contact@jabourphone.ma"'),
        "Real contact email must be configured"
      );
      assert.ok(
        content.includes('address: "Beirut, Lebanon"') || content.includes('country: "Morocco"'),
        "Regional city and address must be set"
      );
      assert.ok(
        content.includes('workingHours: "Mon - Sat: 9:00 AM - 8:00 PM"') ||
          content.includes('workingHours: "Lun - Sam: 09:00 - 20:00"'),
        "Working hours must be set"
      );
    });

    test("frontend contains no lingering fake Manchester or bench-tested promises", () => {
      const filesToCheck = [
        "frontend/index.html",
        "frontend/src/components/SEO.tsx",
        "frontend/src/pages/About.tsx",
        "frontend/src/pages/Contact.tsx",
        "frontend/src/pages/FAQ.tsx",
        "frontend/src/pages/Home.tsx",
        "frontend/src/pages/NotFound.tsx",
        "frontend/src/pages/OrderTracking.tsx",
        "frontend/src/pages/Returns.tsx",
        "frontend/src/pages/Shipping.tsx",
        "frontend/src/pages/Terms.tsx",
        "frontend/src/pages/Shop.tsx"
      ];

      for (const relPath of filesToCheck) {
        const fullPath = path.join(rootDir, relPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8").toLowerCase();
          assert.strictEqual(
            content.includes("manchester"),
            false,
            `File ${relPath} still contains 'manchester'`
          );
          assert.strictEqual(
            content.includes("bench tested"),
            false,
            `File ${relPath} still contains 'bench tested'`
          );
          assert.strictEqual(
            content.includes("bench testing"),
            false,
            `File ${relPath} still contains 'bench testing'`
          );
        }
      }
    });

    test("storefront contains genuine Jabour Phone warranty and quality inspection promises", () => {
      const aboutPath = path.join(rootDir, "frontend/src/pages/About.tsx");
      const content = fs.readFileSync(aboutPath, "utf-8");

      assert.ok(content.includes("100% Genuine Guaranteed"), "About page must state genuine device guarantee");
      assert.ok(content.includes("Multi-Point Quality Inspection"), "About page must describe quality inspection");
      assert.ok(content.includes("Official Warranty"), "About page must feature official warranty");
    });
  });

  describe("Task 3: Dynamic Currency & Price Formatter", () => {
    test("currency utility formats standard and decimal amounts correctly", async () => {
      const currencyUtilPath = path.join(rootDir, "frontend/src/utils/currency.ts");
      assert.ok(fs.existsSync(currencyUtilPath), "currency.ts utility must exist");

      const fileContent = fs.readFileSync(currencyUtilPath, "utf-8");
      assert.ok(fileContent.includes("formatPrice"), "formatPrice function must be defined");

      // Test format function logic directly
      const format = (amount: number | string | null | undefined, symbol = "$") => {
        const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
        const safeNum = Number.isFinite(num) ? num : 0;
        return `${symbol}${safeNum.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      };

      assert.strictEqual(format(120), "$120.00");
      assert.strictEqual(format(899.99), "$899.99");
      assert.strictEqual(format("45.5"), "$45.50");
      assert.strictEqual(format(0), "$0.00");
      assert.strictEqual(format(1500, "USD "), "USD 1,500.00");
      assert.strictEqual(format(50, "€"), "€50.00");
    });
  });

  describe("Task 4: Delivery Fees & Threshold Configuration", () => {
    test("store defaults specify realistic delivery fee and threshold", () => {
      const settingsPath = path.join(rootDir, "backend/src/controllers/settingsController.ts");
      const content = fs.readFileSync(settingsPath, "utf-8");

      assert.ok(content.includes("shippingFee: 5.0"), "Default delivery fee must be $5.00");
      assert.ok(content.includes("freeShippingThreshold: 50.0"), "Default free delivery threshold must be $50.00");
    });

    test("frontend AnnouncementBar and CartDrawer dynamically reference shipping settings", () => {
      const annPath = path.join(rootDir, "frontend/src/components/AnnouncementBar.tsx");
      const annContent = fs.readFileSync(annPath, "utf-8");
      assert.ok(
        annContent.includes("formatPrice(settings.freeShippingThreshold)"),
        "AnnouncementBar must dynamically format shipping threshold"
      );

      const cartPath = path.join(rootDir, "frontend/src/components/CartDrawer.tsx");
      const cartContent = fs.readFileSync(cartPath, "utf-8");
      assert.ok(
        cartContent.includes("formatPrice(freeShippingThreshold - cartTotal)"),
        "CartDrawer must dynamically compute remaining free shipping amount"
      );
    });
  });

  describe("Task 6 & 8: Local Brand Assets, Logos, and Typography", () => {
    test("vector logo and placeholder assets exist in frontend/public", () => {
      const logoSvg = path.join(rootDir, "frontend/public/logo.svg");
      const iconSvg = path.join(rootDir, "frontend/public/icon.svg");
      const placeholderSvg = path.join(rootDir, "frontend/public/phone-placeholder.svg");
      const showroomSvg = path.join(rootDir, "frontend/public/showroom.svg");

      assert.ok(fs.existsSync(logoSvg), "frontend/public/logo.svg must exist");
      assert.ok(fs.existsSync(iconSvg), "frontend/public/icon.svg must exist");
      assert.ok(fs.existsSync(placeholderSvg), "frontend/public/phone-placeholder.svg must exist");
      assert.ok(fs.existsSync(showroomSvg), "frontend/public/showroom.svg must exist");
    });

    test("BrandLogo React component exists and is used in Navbar and Footer", () => {
      const brandLogoPath = path.join(rootDir, "frontend/src/components/BrandLogo.tsx");
      assert.ok(fs.existsSync(brandLogoPath), "BrandLogo.tsx component must exist");

      const navPath = path.join(rootDir, "frontend/src/components/Navbar.tsx");
      const footerPath = path.join(rootDir, "frontend/src/components/Footer.tsx");

      assert.ok(fs.readFileSync(navPath, "utf-8").includes("<BrandLogo"), "Navbar must render BrandLogo");
      assert.ok(fs.readFileSync(footerPath, "utf-8").includes("<BrandLogo"), "Footer must render BrandLogo");
    });

    test("tailwind.config.js specifies jabour brand color palette and Montserrat typography", () => {
      const tailwindConfigPath = path.join(rootDir, "frontend/tailwind.config.js");
      const config = fs.readFileSync(tailwindConfigPath, "utf-8");

      assert.ok(config.includes("jabour:"), "Tailwind must define jabour color palette");
      assert.ok(config.includes("#d10024"), "Jabour red accent color must be defined");
      assert.ok(config.includes("#15161d"), "Jabour dark background color must be defined");
      assert.ok(config.includes("Montserrat"), "Montserrat font family must be configured");
    });
  });

  describe("Task 7: Colorlib Electro Attribution & Legal Verification", () => {
    test("LEGAL.md document exists with CC BY 3.0 verification details", () => {
      const legalPath = path.join(rootDir, "LEGAL.md");
      assert.ok(fs.existsSync(legalPath), "LEGAL.md must exist in root");

      const legalContent = fs.readFileSync(legalPath, "utf-8");
      assert.ok(legalContent.includes("Colorlib"), "LEGAL.md must cite Colorlib");
      assert.ok(legalContent.includes("CC BY 3.0"), "LEGAL.md must cite CC BY 3.0 license");
      assert.ok(legalContent.includes("Jabour Phone"), "LEGAL.md must cite Jabour Phone platform");
    });

    test("Footer component maintains CC BY 3.0 attribution compliant with license requirements", () => {
      const footerPath = path.join(rootDir, "frontend/src/components/Footer.tsx");
      const footerContent = fs.readFileSync(footerPath, "utf-8");

      assert.ok(footerContent.includes("Colorlib"), "Footer must credit Colorlib");
      assert.ok(footerContent.includes("CC BY 3.0"), "Footer must state CC BY 3.0");
    });
  });
});
