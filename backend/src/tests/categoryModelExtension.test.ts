import { test, describe } from "node:test";
import assert from "node:assert";
import { Prisma } from "@prisma/client";
import { getCategories } from "../controllers/categoryController.js";
import { prisma } from "../prisma.js";

describe("Category Model Extension (Task #40)", () => {
  test("Prisma Category scalar fields include all required extended fields", () => {
    const scalarFields = Object.values(Prisma.CategoryScalarFieldEnum);

    // Required fields from Task #40
    assert.ok(scalarFields.includes("name" as any), "Category must have 'name' scalar field");
    assert.ok(scalarFields.includes("slug" as any), "Category must have 'slug' scalar field");
    assert.ok(scalarFields.includes("description" as any), "Category must have 'description' scalar field");
    assert.ok(scalarFields.includes("image" as any), "Category must have 'image' scalar field");
    assert.ok(scalarFields.includes("sortOrder" as any), "Category must have 'sortOrder' scalar field");
    assert.ok(scalarFields.includes("isActive" as any), "Category must have 'isActive' scalar field");
    assert.ok(scalarFields.includes("createdAt" as any), "Category must have 'createdAt' scalar field");
    assert.ok(scalarFields.includes("updatedAt" as any), "Category must have 'updatedAt' scalar field");
  });

  test("Prisma types accept extended category create and update payloads", () => {
    const createPayload: Prisma.CategoryCreateInput = {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest flagship and budget smartphones.",
      image: "https://example.com/phones.jpg",
      sortOrder: 1,
      isActive: true
    };

    const updatePayload: Prisma.CategoryUpdateInput = {
      description: "Updated description",
      sortOrder: 2,
      isActive: false
    };

    assert.strictEqual(createPayload.name, "Smartphones");
    assert.strictEqual(createPayload.sortOrder, 1);
    assert.strictEqual(createPayload.isActive, true);
    assert.strictEqual(updatePayload.isActive, false);
  });

  test("Prisma includes validate Category to Products relation", () => {
    const categoryInclude: Prisma.CategoryInclude = { products: true };
    assert.strictEqual(categoryInclude.products, true);
  });

  test("getCategories returns full category objects with extended fields", async () => {
    const originalFindMany = prisma.category.findMany;
    const now = new Date();

    const mockCategories = [
      {
        id: 1,
        name: "Laptops",
        slug: "laptops",
        description: "High-performance laptops and mobile workstations.",
        image: null,
        sortOrder: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: "Audio",
        slug: "audio",
        description: "Studio monitors, headphones, and audio gear.",
        image: "https://images.unsplash.com/audio.jpg",
        sortOrder: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    (prisma.category as any).findMany = async () => {
      return mockCategories;
    };

    try {
      let jsonResult: any = null;
      const mockReq = {} as any;
      const mockRes = {
        json: (data: any) => {
          jsonResult = data;
          return mockRes;
        },
        status: () => mockRes
      } as any;

      await getCategories(mockReq, mockRes);

      assert.strictEqual(jsonResult.success, true);
      assert.strictEqual(jsonResult.data.length, 2);
      assert.strictEqual(jsonResult.data[0].description, "High-performance laptops and mobile workstations.");
      assert.strictEqual(jsonResult.data[0].sortOrder, 1);
      assert.strictEqual(jsonResult.data[0].isActive, true);
      assert.strictEqual(jsonResult.data[1].image, "https://images.unsplash.com/audio.jpg");
    } finally {
      prisma.category.findMany = originalFindMany;
    }
  });
});
