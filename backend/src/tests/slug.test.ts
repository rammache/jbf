import { test, describe } from "node:test";
import assert from "node:assert";
import {
  slugify,
  isValidSlug,
  generateUniqueCategorySlug,
  resolveCategorySlugOnUpdate,
  isCategorySlugTaken
} from "../utils/slug.js";
import { prisma } from "../prisma.js";

describe("Category Slug Utilities (Task #41)", () => {
  describe("slugify", () => {
    test("converts standard category names into clean kebab-case slugs", () => {
      assert.strictEqual(slugify("Smartphones"), "smartphones");
      assert.strictEqual(slugify("Smartphones & Tablets"), "smartphones-tablets");
      assert.strictEqual(slugify("Audio & Hi-Fi"), "audio-hi-fi");
      assert.strictEqual(slugify("Laptops and Computers"), "laptops-and-computers");
    });

    test("normalizes accented and diacritical characters", () => {
      assert.strictEqual(
        slugify("Électronique & Téléphonie"),
        "electronique-telephonie"
      );
      assert.strictEqual(slugify("Café & Crème"), "cafe-creme");
      assert.strictEqual(slugify("Über Accessories"), "uber-accessories");
    });

    test("handles numbers, mixed casing, and special punctuation", () => {
      assert.strictEqual(slugify("iPhone 15 Pro Max!"), "iphone-15-pro-max");
      assert.strictEqual(slugify("5G Routers & Modems"), "5g-routers-modems");
      assert.strictEqual(
        slugify("Case / Cover (iPhone 15)"),
        "case-cover-iphone-15"
      );
    });

    test("collapses multiple consecutive separators and trims edge hyphens", () => {
      assert.strictEqual(slugify("   --Hello    World--   "), "hello-world");
      assert.strictEqual(slugify("A --- B ___ C   D"), "a-b-c-d");
      assert.strictEqual(slugify("---laptops---"), "laptops");
    });

    test("falls back to default identifier when sanitized output is empty", () => {
      assert.strictEqual(slugify(""), "category");
      assert.strictEqual(slugify("   "), "category");
      assert.strictEqual(slugify("!@#$%^&*()"), "category");
      assert.strictEqual(slugify("", "custom-fallback"), "custom-fallback");
      assert.strictEqual(slugify(null as any), "category");
      assert.strictEqual(slugify(undefined as any), "category");
    });
  });

  describe("isValidSlug", () => {
    test("validates properly formatted slugs", () => {
      assert.strictEqual(isValidSlug("smartphones"), true);
      assert.strictEqual(isValidSlug("smartphones-tablets"), true);
      assert.strictEqual(isValidSlug("iphone-15-pro"), true);
      assert.strictEqual(isValidSlug("5g-modems-2026"), true);
      assert.strictEqual(isValidSlug("a-b-c-d"), true);
    });

    test("rejects invalid slugs", () => {
      assert.strictEqual(isValidSlug("Smartphones"), false); // Uppercase
      assert.strictEqual(isValidSlug("-smartphones"), false); // Leading dash
      assert.strictEqual(isValidSlug("smartphones-"), false); // Trailing dash
      assert.strictEqual(isValidSlug("smartphones--tablets"), false); // Consecutive dashes
      assert.strictEqual(isValidSlug("smartphones tablets"), false); // Spaces
      assert.strictEqual(isValidSlug("smartphones_tablets"), false); // Underscores
      assert.strictEqual(isValidSlug("smartphones!"), false); // Punctuation
      assert.strictEqual(isValidSlug(""), false); // Empty string
      assert.strictEqual(isValidSlug(null as any), false);
    });
  });

  describe("generateUniqueCategorySlug", () => {
    test("returns base slug when there is no collision", async () => {
      const isSlugTaken = async (_slug: string) => false;

      const slug = await generateUniqueCategorySlug({
        name: "Smartphones",
        isSlugTaken
      });

      assert.strictEqual(slug, "smartphones");
    });

    test("respects custom slug when provided", async () => {
      const isSlugTaken = async (_slug: string) => false;

      const slug = await generateUniqueCategorySlug({
        name: "Smartphones & Mobile Devices",
        customSlug: "mobile-phones",
        isSlugTaken
      });

      assert.strictEqual(slug, "mobile-phones");
    });

    test("resolves collision by appending -2 when base slug is taken", async () => {
      const takenSlugs = new Set(["smartphones"]);
      const isSlugTaken = async (slug: string) => takenSlugs.has(slug);

      const slug = await generateUniqueCategorySlug({
        name: "Smartphones",
        isSlugTaken
      });

      assert.strictEqual(slug, "smartphones-2");
    });

    test("resolves multiple collisions sequentially (-2, -3, -4)", async () => {
      const takenSlugs = new Set([
        "smartphones",
        "smartphones-2",
        "smartphones-3"
      ]);
      const isSlugTaken = async (slug: string) => takenSlugs.has(slug);

      const slug = await generateUniqueCategorySlug({
        name: "Smartphones",
        isSlugTaken
      });

      assert.strictEqual(slug, "smartphones-4");
    });

    test("ignores collision with self when currentId is provided", async () => {
      // Simulate that "smartphones" is owned by category id 10
      const isSlugTaken = async (slug: string, excludeId?: number) => {
        if (slug === "smartphones" && excludeId === 10) {
          return false; // Available for category 10
        }
        return slug === "smartphones";
      };

      const slug = await generateUniqueCategorySlug({
        name: "Smartphones",
        currentId: 10,
        isSlugTaken
      });

      assert.strictEqual(slug, "smartphones");
    });
  });

  describe("resolveCategorySlugOnUpdate - Slug Stability on Rename", () => {
    test("keeps old slug stable when category name is updated without explicit slug change", async () => {
      const currentCategory = {
        id: 1,
        name: "Phones",
        slug: "phones"
      };

      const isSlugTaken = async () => false;

      // Rename from "Phones" to "Smartphones & Tablets"
      const resolvedSlug = await resolveCategorySlugOnUpdate({
        currentCategory,
        newName: "Smartphones & Tablets",
        isSlugTaken
      });

      // Crucial: Old slug "phones" must be preserved!
      assert.strictEqual(resolvedSlug, "phones");
    });

    test("keeps old slug stable even with multiple edits and no new slug", async () => {
      const currentCategory = {
        id: 2,
        name: "Audio Equipment",
        slug: "audio"
      };

      const resolvedSlug = await resolveCategorySlugOnUpdate({
        currentCategory,
        newName: "Studio Audio & Monitors",
        isSlugTaken: async () => false
      });

      assert.strictEqual(resolvedSlug, "audio");
    });

    test("updates slug when explicit newSlug is provided", async () => {
      const currentCategory = {
        id: 1,
        name: "Phones",
        slug: "phones"
      };

      const resolvedSlug = await resolveCategorySlugOnUpdate({
        currentCategory,
        newName: "Smartphones",
        newSlug: "smartphones",
        isSlugTaken: async () => false
      });

      assert.strictEqual(resolvedSlug, "smartphones");
    });

    test("handles collision when explicit newSlug collides with another category", async () => {
      const currentCategory = {
        id: 1,
        name: "Phones",
        slug: "phones"
      };

      const takenSlugs = new Set(["tablets"]);
      const isSlugTaken = async (slug: string, excludeId?: number) => {
        if (excludeId === 1) {
          // Exclude self
          return takenSlugs.has(slug);
        }
        return takenSlugs.has(slug);
      };

      const resolvedSlug = await resolveCategorySlugOnUpdate({
        currentCategory,
        newName: "Tablets",
        newSlug: "tablets",
        isSlugTaken
      });

      assert.strictEqual(resolvedSlug, "tablets-2");
    });

    test("regenerates slug from new name when regenerateSlug is true", async () => {
      const currentCategory = {
        id: 1,
        name: "Old Category Name",
        slug: "old-category-name"
      };

      const resolvedSlug = await resolveCategorySlugOnUpdate({
        currentCategory,
        newName: "Brand New Name",
        regenerateSlug: true,
        isSlugTaken: async () => false
      });

      assert.strictEqual(resolvedSlug, "brand-new-name");
    });

    test("regenerates slug from existing name when regenerateSlug is true and newName is not provided", async () => {
      const currentCategory = {
        id: 1,
        name: "Legacy Category",
        slug: "legacy-123"
      };

      const resolvedSlug = await resolveCategorySlugOnUpdate({
        currentCategory,
        regenerateSlug: true,
        isSlugTaken: async () => false
      });

      assert.strictEqual(resolvedSlug, "legacy-category");
    });
  });

  describe("isCategorySlugTaken with Prisma", () => {
    test("queries prisma.category.count with proper where conditions", async () => {
      const originalCount = prisma.category.count;
      let capturedWhere: any = null;

      (prisma.category as any).count = async (args: any) => {
        capturedWhere = args?.where;
        return 1;
      };

      try {
        const taken = await isCategorySlugTaken("laptops", 5);
        assert.strictEqual(taken, true);
        assert.strictEqual(capturedWhere.slug, "laptops");
        assert.deepStrictEqual(capturedWhere.id, { not: 5 });

        (prisma.category as any).count = async (args: any) => {
          capturedWhere = args?.where;
          return 0;
        };

        const free = await isCategorySlugTaken("unheard-category");
        assert.strictEqual(free, false);
        assert.strictEqual(capturedWhere.slug, "unheard-category");
        assert.strictEqual(capturedWhere.id, undefined);
      } finally {
        prisma.category.count = originalCount;
      }
    });
  });
});
