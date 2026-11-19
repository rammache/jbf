import { test, describe } from "node:test";
import assert from "node:assert";
import { prisma } from "../prisma.js";
import {
  getCategories,
  adminGetCategories,
  adminGetCategoryById,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminReorderCategories
} from "../controllers/categoryController.js";

function createMockResponse() {
  const res: any = {
    statusCode: 200,
    body: null,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: any) {
      res.body = data;
      return res;
    }
  };
  return res;
}

describe("Category Admin API & Management (Phase 3)", () => {
  test("Public getCategories queries only active categories ordered by sortOrder then name", async () => {
    const originalFindMany = prisma.category.findMany;
    let capturedArgs: any = null;

    (prisma.category as any).findMany = async (args: any) => {
      capturedArgs = args;
      return [
        {
          id: 1,
          name: "Smartphones",
          slug: "smartphones",
          description: "Flagship phones",
          image: null,
          sortOrder: 0,
          isActive: true,
          _count: { products: 5 }
        }
      ];
    };

    try {
      const res = createMockResponse();
      await getCategories({} as any, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.length, 1);
      assert.deepStrictEqual(capturedArgs.where, { isActive: true });
      assert.deepStrictEqual(capturedArgs.orderBy, [{ sortOrder: "asc" }, { name: "asc" }]);
    } finally {
      prisma.category.findMany = originalFindMany;
    }
  });

  test("adminGetCategories queries all categories ordered by sortOrder then id with product count", async () => {
    const originalFindMany = prisma.category.findMany;
    let capturedArgs: any = null;

    (prisma.category as any).findMany = async (args: any) => {
      capturedArgs = args;
      return [
        { id: 1, name: "Smartphones", sortOrder: 0, isActive: true, _count: { products: 10 } },
        { id: 2, name: "Discontinued", sortOrder: 1, isActive: false, _count: { products: 0 } }
      ];
    };

    try {
      const res = createMockResponse();
      await adminGetCategories({} as any, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.length, 2);
      assert.deepStrictEqual(capturedArgs.orderBy, [{ sortOrder: "asc" }, { id: "asc" }]);
      assert.deepStrictEqual(capturedArgs.include, { _count: { select: { products: true } } });
    } finally {
      prisma.category.findMany = originalFindMany;
    }
  });

  test("adminGetCategoryById returns category or 404 if not found", async () => {
    const originalFindUnique = prisma.category.findUnique;

    try {
      // 404 case
      (prisma.category as any).findUnique = async () => null;
      const res404 = createMockResponse();
      await adminGetCategoryById({ params: { id: "999" } } as any, res404);
      assert.strictEqual(res404.statusCode, 404);
      assert.strictEqual(res404.body.success, false);

      // Found case
      (prisma.category as any).findUnique = async ({ where }: any) => ({
        id: where.id,
        name: "Audio",
        slug: "audio",
        _count: { products: 4 }
      });
      const res200 = createMockResponse();
      await adminGetCategoryById({ params: { id: "2" } } as any, res200);
      assert.strictEqual(res200.statusCode, 200);
      assert.strictEqual(res200.body.data.name, "Audio");
    } finally {
      prisma.category.findUnique = originalFindUnique;
    }
  });

  test("adminCreateCategory auto-generates slug and prevents duplicate names", async () => {
    const originalFindFirst = prisma.category.findFirst;
    const originalCount = prisma.category.count;
    const originalCreate = prisma.category.create;

    try {
      // Duplicate name case
      (prisma.category as any).findFirst = async () => ({ id: 1, name: "Audio" });
      const dupRes = createMockResponse();
      await adminCreateCategory({ body: { name: "Audio" } } as any, dupRes);
      assert.strictEqual(dupRes.statusCode, 400);
      assert.match(dupRes.body.error, /already exists/i);

      // Successful create with auto-slug
      (prisma.category as any).findFirst = async () => null; // No duplicate name, and max order null
      (prisma.category as any).count = async () => 0; // Slug not taken
      let createdPayload: any = null;
      (prisma.category as any).create = async ({ data }: any) => {
        createdPayload = data;
        return { id: 10, ...data, _count: { products: 0 } };
      };

      const successRes = createMockResponse();
      await adminCreateCategory({ body: { name: "Tablets & iPads" } } as any, successRes);

      assert.strictEqual(successRes.statusCode, 201);
      assert.strictEqual(createdPayload.slug, "tablets-ipads");
      assert.strictEqual(createdPayload.sortOrder, 0);
      assert.strictEqual(createdPayload.isActive, true);
    } finally {
      prisma.category.findFirst = originalFindFirst;
      prisma.category.count = originalCount;
      prisma.category.create = originalCreate;
    }
  });

  test("adminUpdateCategory keeps old slug stable on rename unless explicit", async () => {
    const originalFindUnique = prisma.category.findUnique;
    const originalFindFirst = prisma.category.findFirst;
    const originalCount = prisma.category.count;
    const originalUpdate = prisma.category.update;

    const currentCat = {
      id: 5,
      name: "Old Category",
      slug: "old-category",
      sortOrder: 2,
      isActive: true
    };

    try {
      (prisma.category as any).findUnique = async () => currentCat;
      (prisma.category as any).findFirst = async () => null; // No duplicate name
      (prisma.category as any).count = async () => 0;

      let updatedData: any = null;
      (prisma.category as any).update = async ({ data }: any) => {
        updatedData = data;
        return { ...currentCat, ...data, _count: { products: 0 } };
      };

      // 1. Rename without regenerateSlug -> slug remains "old-category"
      const resRename = createMockResponse();
      await adminUpdateCategory(
        { params: { id: "5" }, body: { name: "Renamed Category" } } as any,
        resRename
      );
      assert.strictEqual(resRename.statusCode, 200);
      assert.strictEqual(updatedData.name, "Renamed Category");
      assert.strictEqual(updatedData.slug, "old-category");

      // 2. Rename WITH regenerateSlug: true -> slug becomes "renamed-category"
      const resRegen = createMockResponse();
      await adminUpdateCategory(
        { params: { id: "5" }, body: { name: "Renamed Category", regenerateSlug: true } } as any,
        resRegen
      );
      assert.strictEqual(resRegen.statusCode, 200);
      assert.strictEqual(updatedData.slug, "renamed-category");
    } finally {
      prisma.category.findUnique = originalFindUnique;
      prisma.category.findFirst = originalFindFirst;
      prisma.category.count = originalCount;
      prisma.category.update = originalUpdate;
    }
  });

  test("adminDeleteCategory blocks deletion with 409 when category has products", async () => {
    const originalFindUnique = prisma.category.findUnique;
    const originalDelete = prisma.category.delete;

    try {
      (prisma.category as any).findUnique = async () => ({
        id: 3,
        name: "Laptops",
        _count: { products: 4 }
      });

      const res = createMockResponse();
      await adminDeleteCategory({ params: { id: "3" }, body: {} } as any, res);

      assert.strictEqual(res.statusCode, 409);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.productCount, 4);
      assert.strictEqual(res.body.canReassign, true);
      assert.match(res.body.error, /still contains 4 product\(s\)/);
    } finally {
      prisma.category.findUnique = originalFindUnique;
      prisma.category.delete = originalDelete;
    }
  });

  test("adminDeleteCategory reassigns products and deletes category when reassignToCategoryId is given", async () => {
    const originalFindUnique = prisma.category.findUnique;
    const originalTransaction = prisma.$transaction;

    try {
      (prisma.category as any).findUnique = async ({ where }: any) => {
        if (where.id === 3) {
          return { id: 3, name: "Laptops", _count: { products: 4 } };
        }
        if (where.id === 4) {
          return { id: 4, name: "Computers & Laptops", _count: { products: 12 } };
        }
        return null;
      };

      let transactionCalled = false;
      (prisma as any).$transaction = async (ops: any) => {
        transactionCalled = true;
        return ops;
      };

      const res = createMockResponse();
      await adminDeleteCategory(
        { params: { id: "3" }, body: { reassignToCategoryId: 4 } } as any,
        res
      );

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.reassignedCount, 4);
      assert.ok(transactionCalled, "Database transaction must be invoked to atomically reassign and delete");
    } finally {
      prisma.category.findUnique = originalFindUnique;
      prisma.$transaction = originalTransaction;
    }
  });

  test("adminDeleteCategory immediately deletes category when it has 0 products", async () => {
    const originalFindUnique = prisma.category.findUnique;
    const originalDelete = prisma.category.delete;
    let deletedId: number | null = null;

    try {
      (prisma.category as any).findUnique = async () => ({
        id: 7,
        name: "Empty Category",
        _count: { products: 0 }
      });
      (prisma.category as any).delete = async ({ where }: any) => {
        deletedId = where.id;
        return { id: where.id };
      };

      const res = createMockResponse();
      await adminDeleteCategory({ params: { id: "7" }, body: {} } as any, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(deletedId, 7);
    } finally {
      prisma.category.findUnique = originalFindUnique;
      prisma.category.delete = originalDelete;
    }
  });

  test("adminReorderCategories updates sortOrder of categories in a transaction", async () => {
    const originalTransaction = prisma.$transaction;
    const originalUpdate = prisma.category.update;
    let transactionInvoked = false;

    try {
      (prisma.category as any).update = (args: any) => args;
      (prisma as any).$transaction = async (ops: any[]) => {
        transactionInvoked = true;
        assert.strictEqual(ops.length, 3);
        return ops;
      };

      const res = createMockResponse();
      await adminReorderCategories(
        {
          body: {
            orders: [
              { id: 1, sortOrder: 0 },
              { id: 2, sortOrder: 1 },
              { id: 3, sortOrder: 2 }
            ]
          }
        } as any,
        res
      );

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(transactionInvoked, "Transaction must execute category updates");
    } finally {
      prisma.$transaction = originalTransaction;
      prisma.category.update = originalUpdate;
    }
  });
});
