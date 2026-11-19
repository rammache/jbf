import { describe, test } from "node:test";
import assert from "node:assert";
import { prisma } from "../prisma.js";
import {
  createProductSchema,
  updateProductSchema,
  bulkProductActionSchema
} from "../schemas/product.js";
import {
  generateUniqueProductHandle,
  resolveProductHandleOnUpdate
} from "../utils/slug.js";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminDuplicateProduct,
  adminBulkProductActions
} from "../controllers/adminProductController.js";
import { createOrder } from "../controllers/orderController.js";

describe("Phase 4 - Product Management & Validation", () => {
  describe("Zod Validation & Sale Price Rules", () => {
    test("validates valid product creation payload", () => {
      const valid = {
        title: "iPhone 15 Pro",
        price: 999,
        compare: 1099,
        categoryId: 1,
        brand: "Apple",
        stock: 20,
        lowStockThreshold: 5,
        condition: "NEW",
        storage: "256GB",
        ram: "8GB",
        screen: "6.1in OLED 120Hz",
        battery: "3274 mAh",
        camera: "48MP Triple Camera",
        network: "5G",
        warranty: "1 Year Official",
        processor: "A17 Pro",
        isActive: true,
        isFeatured: true
      };

      const result = createProductSchema.safeParse(valid);
      assert.strictEqual(result.success, true);
    });

    test("enforces sale price rule: compare must be greater than price", () => {
      // compare <= price must be rejected
      const invalidLower = {
        title: "Samsung S24 Ultra",
        price: 1200,
        compare: 1100, // compare is less than price
        categoryId: 1,
        brand: "Samsung"
      };
      const resLower = createProductSchema.safeParse(invalidLower);
      assert.strictEqual(resLower.success, false);
      assert.match(resLower.error?.issues[0]?.message || "", /must be greater than the selling price/i);

      // compare equal to price must also be rejected
      const invalidEqual = {
        title: "Samsung S24 Ultra",
        price: 1200,
        compare: 1200,
        categoryId: 1,
        brand: "Samsung"
      };
      const resEqual = createProductSchema.safeParse(invalidEqual);
      assert.strictEqual(resEqual.success, false);

      // compare null or omitted is valid (regular non-discounted product)
      const validNoDiscount = {
        title: "Samsung S24 Ultra",
        price: 1200,
        compare: null,
        categoryId: 1,
        brand: "Samsung"
      };
      const resNoDiscount = createProductSchema.safeParse(validNoDiscount);
      assert.strictEqual(resNoDiscount.success, true);
    });

    test("updateProductSchema validates price vs compare on update", () => {
      const invalid = updateProductSchema.safeParse({
        price: 500,
        compare: 450
      });
      assert.strictEqual(invalid.success, false);

      const valid = updateProductSchema.safeParse({
        price: 500,
        compare: 600
      });
      assert.strictEqual(valid.success, true);
    });

    test("rejects negative stock and invalid condition", () => {
      const invalidStock = createProductSchema.safeParse({
        title: "Test Phone",
        price: 300,
        categoryId: 1,
        brand: "Generic",
        stock: -5
      });
      assert.strictEqual(invalidStock.success, false);

      const invalidCondition = createProductSchema.safeParse({
        title: "Test Phone",
        price: 300,
        categoryId: 1,
        brand: "Generic",
        condition: "ANCIENT" as any
      });
      assert.strictEqual(invalidCondition.success, false);
    });
  });

  describe("Product Handle Generation & Stability on Rename", () => {
    test("generateUniqueProductHandle avoids collisions by appending -2, -3", async () => {
      const takenHandles = new Set(["iphone-15-pro", "iphone-15-pro-2"]);
      const mockIsTaken = (handle: string) => takenHandles.has(handle);

      const handle = await generateUniqueProductHandle({
        title: "iPhone 15 Pro",
        isHandleTaken: mockIsTaken
      });

      assert.strictEqual(handle, "iphone-15-pro-3");
    });

    test("resolveProductHandleOnUpdate keeps old handle stable on rename by default", async () => {
      const currentProduct = {
        id: 10,
        handle: "iphone-14-128gb",
        title: "iPhone 14 128GB"
      };

      // Renamed to "iPhone 14 Midnight" but no regenerate requested
      const resolved = await resolveProductHandleOnUpdate({
        currentProduct,
        newTitle: "iPhone 14 Midnight",
        isHandleTaken: () => false
      });

      assert.strictEqual(resolved, "iphone-14-128gb");
    });

    test("resolveProductHandleOnUpdate regenerates handle when explicitly requested", async () => {
      const currentProduct = {
        id: 10,
        handle: "iphone-14-128gb",
        title: "iPhone 14 128GB"
      };

      const resolved = await resolveProductHandleOnUpdate({
        currentProduct,
        newTitle: "iPhone 14 Midnight",
        regenerateHandle: true,
        isHandleTaken: () => false
      });

      assert.strictEqual(resolved, "iphone-14-midnight");
    });
  });

  describe("Admin Delete / Archive Rules (Task #12)", () => {
    test("adminDeleteProduct archives product if it appears in past orders", async () => {
      let updatedData: any = null;
      let deletedId: any = null;

      const origFindUnique = prisma.product.findUnique;
      const origUpdate = prisma.product.update;
      const origDelete = prisma.product.delete;

      (prisma.product as any).findUnique = async () => ({
        id: 15,
        title: "Ordered Phone",
        _count: { orderItems: 3 } // Has 3 past orders!
      });

      (prisma.product as any).update = async (args: any) => {
        updatedData = args;
        return { id: 15, isArchived: true, isActive: false };
      };

      (prisma.product as any).delete = async (args: any) => {
        deletedId = args;
        return {};
      };

      try {
        const mockReq = { params: { id: "15" } } as any;
        let jsonRes: any = null;
        const mockRes = {
          json: (d: any) => { jsonRes = d; return mockRes; },
          status: () => mockRes
        } as any;

        await adminDeleteProduct(mockReq, mockRes);

        assert.strictEqual(jsonRes.success, true);
        assert.strictEqual(jsonRes.archived, true);
        assert.strictEqual(jsonRes.deleted, false);
        assert.strictEqual(updatedData.data.isArchived, true);
        assert.strictEqual(updatedData.data.isActive, false);
        assert.strictEqual(deletedId, null); // NOT deleted from db
      } finally {
        prisma.product.findUnique = origFindUnique;
        prisma.product.update = origUpdate;
        prisma.product.delete = origDelete;
      }
    });

    test("adminDeleteProduct hard-deletes product if it has 0 orders", async () => {
      let deletedId: any = null;
      const origFindUnique = prisma.product.findUnique;
      const origDelete = prisma.product.delete;

      (prisma.product as any).findUnique = async () => ({
        id: 20,
        title: "Never Ordered Phone",
        _count: { orderItems: 0 }
      });

      (prisma.product as any).delete = async (args: any) => {
        deletedId = args.where.id;
        return {};
      };

      try {
        const mockReq = { params: { id: "20" } } as any;
        let jsonRes: any = null;
        const mockRes = {
          json: (d: any) => { jsonRes = d; return mockRes; },
          status: () => mockRes
        } as any;

        await adminDeleteProduct(mockReq, mockRes);

        assert.strictEqual(jsonRes.success, true);
        assert.strictEqual(jsonRes.archived, false);
        assert.strictEqual(jsonRes.deleted, true);
        assert.strictEqual(deletedId, 20);
      } finally {
        prisma.product.findUnique = origFindUnique;
        prisma.product.delete = origDelete;
      }
    });
  });

  describe("Product Duplication (Task #11)", () => {
    test("adminDuplicateProduct creates a copy with unique handle and draft status", async () => {
      let createdData: any = null;
      const origFindUnique = prisma.product.findUnique;
      const origCreate = prisma.product.create;
      const origCount = prisma.product.count;

      (prisma.product as any).findUnique = async () => ({
        id: 5,
        title: "Google Pixel 8",
        handle: "google-pixel-8",
        price: 699,
        compare: 799,
        categoryId: 2,
        brand: "Google",
        sku: "GP-8",
        stock: 10,
        lowStockThreshold: 3,
        description: "Great camera phone",
        spec: "6.2in OLED · 8GB · 128GB",
        condition: "NEW",
        finishes: ["Obsidian"],
        images: ["/uploads/pixel8.jpg"]
      });

      (prisma.product as any).count = async () => 0;

      (prisma.product as any).create = async (args: any) => {
        createdData = args.data;
        return { id: 6, ...args.data };
      };

      try {
        const mockReq = { params: { id: "5" } } as any;
        let jsonRes: any = null;
        const mockRes = {
          json: (d: any) => { jsonRes = d; return mockRes; },
          status: () => mockRes
        } as any;

        await adminDuplicateProduct(mockReq, mockRes);

        assert.strictEqual(jsonRes.success, true);
        assert.strictEqual(createdData.title, "Google Pixel 8 (Copy)");
        assert.strictEqual(createdData.isActive, false); // Draft mode
        assert.strictEqual(createdData.handle, "google-pixel-8-copy");
        assert.strictEqual(createdData.sku, "GP-8-COPY");
      } finally {
        prisma.product.findUnique = origFindUnique;
        prisma.product.create = origCreate;
        prisma.product.count = origCount;
      }
    });
  });

  describe("Stock Validation & Checkout Guards (Task #13)", () => {
    test("createOrder rejects checkout if product stock is 0", async () => {
      const origFindUnique = prisma.product.findUnique;

      (prisma.product as any).findUnique = async () => ({
        id: 1,
        title: "Sold Out Device",
        stock: 0, // OUT OF STOCK
        isActive: true,
        isArchived: false
      });

      try {
        const mockReq = {
          body: {
            customerEmail: "user@example.com",
            customerName: "John Doe",
            customerAddress: "123 Main St",
            items: [{ productId: 1, title: "Sold Out Device", quantity: 1, price: 500 }]
          }
        } as any;

        let statusCode = 200;
        let jsonRes: any = null;
        const mockRes = {
          status: (code: number) => { statusCode = code; return mockRes; },
          json: (d: any) => { jsonRes = d; return mockRes; }
        } as any;

        await createOrder(mockReq, mockRes);

        assert.strictEqual(statusCode, 400);
        assert.strictEqual(jsonRes.success, false);
        assert.match(jsonRes.error, /out of stock/i);
      } finally {
        prisma.product.findUnique = origFindUnique;
      }
    });

    test("createOrder rejects checkout if requested quantity exceeds inventory", async () => {
      const origFindUnique = prisma.product.findUnique;

      (prisma.product as any).findUnique = async () => ({
        id: 2,
        title: "Limited Stock Phone",
        stock: 3, // Only 3 left
        isActive: true,
        isArchived: false
      });

      try {
        const mockReq = {
          body: {
            customerEmail: "user@example.com",
            customerName: "Jane Doe",
            customerAddress: "456 Oak St",
            items: [{ productId: 2, title: "Limited Stock Phone", quantity: 5, price: 300 }]
          }
        } as any;

        let statusCode = 200;
        let jsonRes: any = null;
        const mockRes = {
          status: (code: number) => { statusCode = code; return mockRes; },
          json: (d: any) => { jsonRes = d; return mockRes; }
        } as any;

        await createOrder(mockReq, mockRes);

        assert.strictEqual(statusCode, 400);
        assert.strictEqual(jsonRes.success, false);
        assert.match(jsonRes.error, /3 unit\(s\) of 'Limited Stock Phone' are available/i);
      } finally {
        prisma.product.findUnique = origFindUnique;
      }
    });

    test("createOrder decrements product stock in transaction when order succeeds", async () => {
      const origFindUnique = prisma.product.findUnique;
      const origTransaction = prisma.$transaction;

      (prisma.product as any).findUnique = async () => ({
        id: 3,
        title: "In Stock Phone",
        stock: 10,
        isActive: true,
        isArchived: false
      });

      let decrementedArgs: any = null;
      let orderCreatedData: any = null;

      (prisma as any).$transaction = async (fn: any) => {
        const mockTx = {
          product: {
            update: async (args: any) => { decrementedArgs = args; return {}; }
          },
          order: {
            create: async (args: any) => {
              orderCreatedData = args;
              return { id: "order-123", ...args.data };
            }
          }
        };
        return fn(mockTx);
      };

      try {
        const mockReq = {
          body: {
            customerEmail: "customer@example.com",
            customerName: "Happy Buyer",
            customerAddress: "789 Pine Rd",
            items: [{ productId: 3, title: "In Stock Phone", quantity: 2, price: 400 }]
          }
        } as any;

        let statusCode = 200;
        let jsonRes: any = null;
        const mockRes = {
          status: (code: number) => { statusCode = code; return mockRes; },
          json: (d: any) => { jsonRes = d; return mockRes; }
        } as any;

        await createOrder(mockReq, mockRes);

        assert.strictEqual(statusCode, 201);
        assert.strictEqual(jsonRes.success, true);
        assert.strictEqual(decrementedArgs.where.id, 3);
        assert.strictEqual(decrementedArgs.data.stock.decrement, 2);
        assert.strictEqual(orderCreatedData.data.totalAmount, 800);
      } finally {
        prisma.product.findUnique = origFindUnique;
        prisma.$transaction = origTransaction;
      }
    });
  });

  describe("Bulk Actions (Task #16)", () => {
    test("validates bulkProductActionSchema", () => {
      const valid = bulkProductActionSchema.safeParse({
        ids: [1, 2, 3],
        action: "activate"
      });
      assert.strictEqual(valid.success, true);

      const invalid = bulkProductActionSchema.safeParse({
        ids: [],
        action: "delete"
      });
      assert.strictEqual(invalid.success, false);
    });

    test("adminBulkProductActions archives products with orders and deletes products without orders", async () => {
      const origFindMany = prisma.product.findMany;
      const origDeleteMany = prisma.product.deleteMany;
      const origUpdateMany = prisma.product.updateMany;

      // Product 1 has orders, Product 2 has NO orders
      (prisma.product as any).findMany = async () => [{ id: 1 }];

      let deletedWhere: any = null;
      let archivedWhere: any = null;

      (prisma.product as any).deleteMany = async (args: any) => {
        deletedWhere = args;
        return { count: 1 };
      };

      (prisma.product as any).updateMany = async (args: any) => {
        archivedWhere = args;
        return { count: 1 };
      };

      try {
        const mockReq = {
          body: {
            ids: [1, 2],
            action: "delete"
          }
        } as any;

        let jsonRes: any = null;
        const mockRes = {
          json: (d: any) => { jsonRes = d; return mockRes; },
          status: () => mockRes
        } as any;

        await adminBulkProductActions(mockReq, mockRes);

        assert.strictEqual(jsonRes.success, true);
        assert.strictEqual(jsonRes.deletedCount, 1);
        assert.strictEqual(jsonRes.archivedCount, 1);
        assert.deepStrictEqual(deletedWhere.where.id.in, [2]);
        assert.deepStrictEqual(archivedWhere.where.id.in, [1]);
      } finally {
        prisma.product.findMany = origFindMany;
        prisma.product.deleteMany = origDeleteMany;
        prisma.product.updateMany = origUpdateMany;
      }
    });
  });
});
