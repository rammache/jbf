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
});
