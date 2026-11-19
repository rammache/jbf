import { test, describe } from "node:test";
import assert from "node:assert";
import { Prisma } from "@prisma/client";
import { getProducts, getProductByHandle } from "../controllers/productController.js";
import { prisma } from "../prisma.js";

describe("Product-Category Relation (Task #39)", () => {
  test("Prisma Product scalar fields include categoryId and exclude category", () => {
    const scalarFields = Object.values(Prisma.ProductScalarFieldEnum);
    assert.ok(scalarFields.includes("categoryId" as any), "Product must have categoryId scalar field");
    assert.ok(!scalarFields.includes("category" as any), "Product must not have category scalar field");
  });

  test("Prisma includes validate category and products relations", () => {
    const productInclude: Prisma.ProductInclude = { category: true };
    const categoryInclude: Prisma.CategoryInclude = { products: true };
    assert.strictEqual(productInclude.category, true);
    assert.strictEqual(categoryInclude.products, true);
  });

  test("getProducts query builder queries category relation and includes category in output", async () => {
    let capturedArgs: any = null;
    const originalFindMany = prisma.product.findMany;

    (prisma.product as any).findMany = async (args: any) => {
      capturedArgs = args;
      return [
        {
          id: 1,
          handle: "test-phone",
          title: "Test Phone",
          price: 999,
          compare: null,
          categoryId: 1,
          brand: "TestBrand",
          spec: "6.7in OLED",
          rating: 5,
          reviews: 1,
          finishes: [],
          images: [],
          featured: true,
          category: { id: 1, name: "Laptops", slug: "laptops" }
        }
      ];
    };

    try {
      // Test category filter
      const mockReq = { query: { category: "Laptops" } } as any;
      let jsonResult: any = null;
      const mockRes = {
        json: (data: any) => { jsonResult = data; return mockRes; },
        status: () => mockRes
      } as any;

      await getProducts(mockReq, mockRes);
      assert.deepStrictEqual(capturedArgs.where.category, {
        OR: [
          { name: { equals: "Laptops", mode: "insensitive" } },
          { slug: { equals: "Laptops", mode: "insensitive" } }
        ]
      });
      assert.deepStrictEqual(capturedArgs.include, { category: true });
      assert.strictEqual(jsonResult.success, true);
      assert.strictEqual(jsonResult.data[0].categoryId, 1);
      assert.strictEqual(jsonResult.data[0].category.name, "Laptops");

      // Test keyword search query
      const mockSearchReq = { query: { q: "bench" } } as any;
      await getProducts(mockSearchReq, mockRes);
      const orClause = capturedArgs.where.OR;
      const categorySearch = orClause.find((c: any) => c.category);
      assert.deepStrictEqual(categorySearch, {
        category: { name: { contains: "bench", mode: "insensitive" } }
      });
    } finally {
      prisma.product.findMany = originalFindMany;
    }
  });

  test("getProductByHandle includes category and queries related products by categoryId", async () => {
    let capturedFindUniqueArgs: any = null;
    let capturedRelatedArgs: any = null;
    const originalFindUnique = prisma.product.findUnique;
    const originalFindMany = prisma.product.findMany;

    (prisma.product as any).findUnique = async (args: any) => {
      capturedFindUniqueArgs = args;
      return {
        id: 42,
        handle: "test-device",
        title: "Test Device",
        price: 500,
        categoryId: 7,
        category: { id: 7, name: "Audio", slug: "audio" }
      };
    };

    (prisma.product as any).findMany = async (args: any) => {
      capturedRelatedArgs = args;
      return [];
    };

    try {
      const mockReq = { params: { handle: "test-device" } } as any;
      let jsonResult: any = null;
      const mockRes = {
        json: (data: any) => { jsonResult = data; return mockRes; },
        status: () => mockRes
      } as any;

      await getProductByHandle(mockReq, mockRes);

      assert.deepStrictEqual(capturedFindUniqueArgs.include, { category: true });
      assert.strictEqual(capturedRelatedArgs.where.categoryId, 7);
      assert.strictEqual(capturedRelatedArgs.where.handle.not, "test-device");
      assert.deepStrictEqual(capturedRelatedArgs.include, { category: true });
      assert.strictEqual(jsonResult.success, true);
      assert.strictEqual(jsonResult.data.categoryId, 7);
    } finally {
      prisma.product.findUnique = originalFindUnique;
      prisma.product.findMany = originalFindMany;
    }
  });
});
