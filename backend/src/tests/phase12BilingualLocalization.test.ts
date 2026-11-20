import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

const rootDir = path.resolve(__dirname, "../../..");

describe("Phase 12 - Bilingual Localization (Arabic & French with RTL Support)", () => {
  describe("Task 1: Translation Dictionaries Completeness (translations.ts)", () => {
    const translationsPath = path.join(rootDir, "frontend/src/i18n/translations.ts");

    it("translations file exists in frontend/src/i18n/translations.ts", () => {
      assert.ok(fs.existsSync(translationsPath), "frontend/src/i18n/translations.ts must exist");
    });

    it("defines full French ('fr') dictionary with all sections", () => {
      const content = fs.readFileSync(translationsPath, "utf-8");
      assert.ok(content.includes('fr: {'), "Must include French dictionary");
      assert.ok(content.includes('home: "Accueil"'), "French nav home must be Accueil");
      assert.ok(content.includes('shop: "Boutique"'), "French nav shop must be Boutique");
      assert.ok(content.includes('currencySymbol: "DH"'), "French currency symbol must be DH");
      assert.ok(content.includes('codTitle: "Paiement à la livraison'), "French COD must be defined");
      assert.ok(content.includes('freeShipping: "Livraison express gratuite partout au Maroc dès 300 DH"'));
    });

    it("defines full Arabic ('ar') dictionary with proper Arabic strings", () => {
      const content = fs.readFileSync(translationsPath, "utf-8");
      assert.ok(content.includes('ar: {'), "Must include Arabic dictionary");
      assert.ok(content.includes('home: "الرئيسية"'), "Arabic nav home must be الرئيسية");
      assert.ok(content.includes('shop: "المتجر"'), "Arabic nav shop must be المتجر");
      assert.ok(content.includes('currencySymbol: "د.م."'), "Arabic currency symbol must be د.م.");
      assert.ok(content.includes('codTitle: "الدفع نقداً عند الاستلام'), "Arabic COD must be defined");
      assert.ok(content.includes('freeShipping: "🚚 توصيل سريع ومجاني في جميع أنحاء المغرب للطلبات ابتداءً من 300 د.م."'));
    });
  });

  describe("Task 2: Language Context & State Management (LanguageContext.tsx)", () => {
    const contextPath = path.join(rootDir, "frontend/src/context/LanguageContext.tsx");

    it("LanguageContext.tsx exports LanguageProvider and useLanguage hook", () => {
      assert.ok(fs.existsSync(contextPath), "LanguageContext.tsx must exist");
      const content = fs.readFileSync(contextPath, "utf-8");
      assert.ok(content.includes("export const LanguageProvider"), "Must export LanguageProvider");
      assert.ok(content.includes("export const useLanguage"), "Must export useLanguage");
    });

    it("implements localStorage persistence with jabour-lang key", () => {
      const content = fs.readFileSync(contextPath, "utf-8");
      assert.ok(content.includes('STORAGE_KEY = "jabour-lang"'), "Must use jabour-lang localStorage key");
    });

    it("supports dynamic document direction and language attributes", () => {
      const content = fs.readFileSync(contextPath, "utf-8");
      assert.ok(content.includes('document.documentElement.setAttribute("dir", direction)'), "Must update dir attribute");
      assert.ok(content.includes('document.documentElement.setAttribute("lang", language)'), "Must update lang attribute");
      assert.ok(content.includes('language === "ar" ? "rtl" : "ltr"'), "Must set rtl for Arabic and ltr for French");
    });

    it("adapts currency symbol dynamically between DH and د.م.", () => {
      const content = fs.readFileSync(contextPath, "utf-8");
      assert.ok(content.includes('language === "ar" ? "د.م." : "DH"'), "Must provide localized currency symbol");
    });
  });

  describe("Task 3: Language Switcher Component & Storefront Integration", () => {
    const switcherPath = path.join(rootDir, "frontend/src/components/LanguageSwitcher.tsx");

    it("LanguageSwitcher component exists in frontend/src/components", () => {
      assert.ok(fs.existsSync(switcherPath), "LanguageSwitcher.tsx must exist");
      const content = fs.readFileSync(switcherPath, "utf-8");
      assert.ok(content.includes("export const LanguageSwitcher"), "Must export LanguageSwitcher");
      assert.ok(content.includes("toggleLanguage"), "Must support toggleLanguage");
      assert.ok(content.includes("العربية"), "Must display Arabic label");
      assert.ok(content.includes("Français"), "Must display French label");
    });

    it("AnnouncementBar and Navbar integrate LanguageSwitcher", () => {
      const annPath = path.join(rootDir, "frontend/src/components/AnnouncementBar.tsx");
      const navPath = path.join(rootDir, "frontend/src/components/Navbar.tsx");

      const annContent = fs.readFileSync(annPath, "utf-8");
      const navContent = fs.readFileSync(navPath, "utf-8");

      assert.ok(annContent.includes("<LanguageSwitcher"), "AnnouncementBar must render LanguageSwitcher");
      assert.ok(navContent.includes("<LanguageSwitcher"), "Navbar must render LanguageSwitcher");
    });

    it("App.tsx wraps application with LanguageProvider", () => {
      const appPath = path.join(rootDir, "frontend/src/App.tsx");
      const content = fs.readFileSync(appPath, "utf-8");
      assert.ok(content.includes("<LanguageProvider>"), "App.tsx must include LanguageProvider");
    });
  });

  describe("Task 4: Bidirectional Layout, Cairo Font & RTL CSS", () => {
    it("index.css configures font-arabic and [dir=rtl] typography", () => {
      const cssPath = path.join(rootDir, "frontend/src/index.css");
      const content = fs.readFileSync(cssPath, "utf-8");
      assert.ok(content.includes('[dir="rtl"]') || content.includes(".font-arabic"), "index.css must configure RTL or font-arabic");
      assert.ok(content.includes("Cairo"), "index.css must configure Cairo font for Arabic");
    });

    it("index.html pre-connects Google Fonts Cairo", () => {
      const htmlPath = path.join(rootDir, "frontend/index.html");
      const content = fs.readFileSync(htmlPath, "utf-8");
      assert.ok(content.includes("Cairo"), "index.html must load Cairo font family");
    });
  });

  describe("Task 5: Complete Storefront Translation Integration Across All Views", () => {
    it("SearchModal integrates useLanguage and translations", () => {
      const filePath = path.join(rootDir, "frontend/src/components/SearchModal.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "SearchModal must import useLanguage");
      assert.ok(content.includes('t("header.searchPlaceholder")'), "Must use header.searchPlaceholder");
      assert.ok(content.includes('t("header.searchEsc")'), "Must use header.searchEsc");
    });

    it("ProductCard integrates useLanguage and localized badges", () => {
      const filePath = path.join(rootDir, "frontend/src/components/ProductCard.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "ProductCard must import useLanguage");
      assert.ok(content.includes('t("shop.outOfStock")'), "Must translate out of stock");
      assert.ok(content.includes('t("shop.sale")'), "Must translate sale");
      assert.ok(content.includes('t("shop.addToCart")'), "Must translate quick add button");
    });

    it("Shop page integrates useLanguage and localized filters", () => {
      const filePath = path.join(rootDir, "frontend/src/pages/Shop.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "Shop must import useLanguage");
      assert.ok(content.includes('t("shop.categories")'), "Must translate categories");
      assert.ok(content.includes('t("shop.brands")'), "Must translate brands");
      assert.ok(content.includes('t("shop.filters")'), "Must translate filters button");
    });

    it("ProductDetail integrates useLanguage and localized specifications", () => {
      const filePath = path.join(rootDir, "frontend/src/pages/ProductDetail.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "ProductDetail must import useLanguage");
      assert.ok(content.includes('t("product.orderOnWhatsapp")'), "Must translate WhatsApp button");
      assert.ok(content.includes('t("product.specifications")'), "Must translate specs header");
    });

    it("CartDrawer integrates useLanguage and localized calculations", () => {
      const filePath = path.join(rootDir, "frontend/src/components/CartDrawer.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "CartDrawer must import useLanguage");
      assert.ok(content.includes('t("cart.title")'), "Must translate cart title");
      assert.ok(content.includes('t("cart.checkout")'), "Must translate checkout button");
    });

    it("CheckoutModal integrates useLanguage and localized payment details", () => {
      const filePath = path.join(rootDir, "frontend/src/components/CheckoutModal.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "CheckoutModal must import useLanguage");
      assert.ok(content.includes('t("checkout.confirmOrder")'), "Must translate confirm order");
      assert.ok(content.includes('t("checkout.codTitle")'), "Must translate COD title");
    });

    it("OrderTracking integrates useLanguage and localized statuses", () => {
      const filePath = path.join(rootDir, "frontend/src/pages/OrderTracking.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "OrderTracking must import useLanguage");
      assert.ok(content.includes('t("tracking.statusPending")'), "Must translate statusPending");
      assert.ok(content.includes('t("tracking.searchBtn")'), "Must translate search button");
    });

    it("Home page integrates useLanguage for Hero and feature highlights", () => {
      const filePath = path.join(rootDir, "frontend/src/pages/Home.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "Home must import useLanguage");
      assert.ok(content.includes('t("hero.title")'), "Must translate hero title");
      assert.ok(content.includes('t("home.shopByDepartment")'), "Must translate shop by department");
    });

    it("All 7 informational pages integrate useLanguage and translations", () => {
      const pages = ["About", "Contact", "FAQ", "Shipping", "Returns", "Privacy", "Terms"];
      for (const page of pages) {
        const filePath = path.join(rootDir, `frontend/src/pages/${page}.tsx`);
        const content = fs.readFileSync(filePath, "utf-8");
        assert.ok(content.includes("useLanguage"), `${page}.tsx must import useLanguage`);
      }
    });

    it("SettingsContext connects to useLanguage for dynamic currency symbol", () => {
      const filePath = path.join(rootDir, "frontend/src/context/SettingsContext.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("useLanguage"), "SettingsContext must import useLanguage");
      assert.ok(content.includes("langCurrencySymbol"), "Must use localized currency symbol");
    });
  });
});
