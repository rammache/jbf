import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { Prisma } from "@prisma/client";
import { toNumber, toDecimal, formatDecimal } from "../utils/decimal.js";
import { createPaginationEnvelope, parsePaginationParams } from "../utils/pagination.js";
import {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  errorHandler,
  notFoundHandler
} from "../middleware/errorHandler.js";
import { securityHeaders, getCorsOptions } from "../middleware/security.js";
import { getHealthCheck } from "../controllers/healthController.js";
import { prisma } from "../prisma.js";

const rootDir = path.resolve(__dirname, "../../..");

describe("Phase 8 - Data Model And Backend Quality", () => {
  describe("Task 1: Decimal Precision & Monetary Calculation", () => {
    it("converts Prisma.Decimal, number, and string correctly to number", () => {
      const dec = new Prisma.Decimal("123.45");
      assert.strictEqual(toNumber(dec), 123.45);
      assert.strictEqual(toNumber(123.45), 123.45);
      assert.strictEqual(toNumber("123.45"), 123.45);
      assert.strictEqual(toNumber(null, 0), 0);
      assert.strictEqual(toNumber(undefined, 10), 10);
      assert.strictEqual(toNumber("invalid", 5), 5);
    });

    it("creates Prisma.Decimal with standard 2 decimal places precision", () => {
      const d1 = toDecimal(99.99);
      assert.ok(d1 instanceof Prisma.Decimal);
      assert.strictEqual(d1.toString(), "99.99");

      // Solves JavaScript floating point precision issues (e.g. 0.1 + 0.2)
      const d2 = toDecimal(0.1 + 0.2);
      assert.strictEqual(d2.toFixed(2), "0.30");
      assert.strictEqual(formatDecimal(d2), "0.30");
    });

    it("formats Decimal to standard 2-decimal string representation", () => {
      assert.strictEqual(formatDecimal(49.9), "49.90");
      assert.strictEqual(formatDecimal(new Prisma.Decimal("1500")), "1500.00");
      assert.strictEqual(formatDecimal(null), "0.00");
    });
  });

  describe("Task 2, 3, 4: Prisma Schema, Migrations, Indexes & Constraints", () => {
    const schemaPath = path.join(rootDir, "backend/prisma/schema.prisma");
    const schemaContent = fs.readFileSync(schemaPath, "utf-8");

    it("enforces Decimal type for all monetary fields in schema.prisma", () => {
      // Product
      assert.ok(schemaContent.includes("price             Decimal     @db.Decimal(10, 2)"), "Product.price must be Decimal");
      assert.ok(schemaContent.includes("compare           Decimal?    @db.Decimal(10, 2)"), "Product.compare must be Decimal");
      assert.ok(schemaContent.includes("costPrice         Decimal?    @db.Decimal(10, 2)"), "Product.costPrice must be Decimal");

      // Order
      assert.ok(schemaContent.includes("totalAmount     Decimal      @db.Decimal(10, 2)"), "Order.totalAmount must be Decimal");
      assert.ok(schemaContent.includes("subtotal        Decimal      @default(0) @db.Decimal(10, 2)"), "Order.subtotal must be Decimal");
      assert.ok(schemaContent.includes("shippingFee     Decimal      @default(0) @db.Decimal(10, 2)"), "Order.shippingFee must be Decimal");

      // StoreSettings
      assert.ok(schemaContent.includes("shippingFee           Decimal  @default(5.00) @db.Decimal(10, 2)"), "StoreSettings.shippingFee must be Decimal");
      assert.ok(schemaContent.includes("freeShippingThreshold Decimal  @default(50.00) @db.Decimal(10, 2)"), "StoreSettings.freeShippingThreshold must be Decimal");

      // Coupon
      assert.ok(schemaContent.includes("discountValue  Decimal   @db.Decimal(10, 2)"), "Coupon.discountValue must be Decimal");
    });

    it("enforces required indexes across models", () => {
      assert.ok(schemaContent.includes("@@index([categoryId])"), "Product must index categoryId");
      assert.ok(schemaContent.includes("@@index([isActive])"), "Product must index isActive");
      assert.ok(schemaContent.includes("@@index([isFeatured])"), "Product must index isFeatured");
      assert.ok(schemaContent.includes("@@index([status])"), "Order must index status");
      assert.ok(schemaContent.includes("@@index([createdAt])"), "Order must index createdAt");
      assert.ok(schemaContent.includes("@@index([orderId])"), "OrderItem must index orderId");
      assert.ok(schemaContent.includes("@@index([productId])"), "OrderItem must index productId");
    });

    it("enforces required unique constraints", () => {
      assert.ok(schemaContent.includes("sku               String?     @unique"), "Product.sku must be unique");
      assert.ok(schemaContent.includes("orderNumber     String       @unique"), "Order.orderNumber must be unique");
      assert.ok(schemaContent.includes("handle            String      @unique"), "Product.handle must be unique");
      assert.ok(schemaContent.includes("slug        String      @unique"), "Category.slug must be unique");
      assert.ok(schemaContent.includes("code           String    @unique"), "Coupon.code must be unique");
    });

    it("contains committed migration SQL in prisma/migrations", () => {
      const migrationDir = path.join(rootDir, "backend/prisma/migrations/20261119000000_init");
      assert.ok(fs.existsSync(migrationDir), "Migration folder must exist");
      const migrationSql = fs.readFileSync(path.join(migrationDir, "migration.sql"), "utf-8");
      assert.ok(migrationSql.includes('CREATE TABLE "Product"'), "Migration must create Product table");
      assert.ok(migrationSql.includes('DECIMAL(10,2)'), "Migration must define DECIMAL columns");
      assert.ok(migrationSql.includes('CREATE UNIQUE INDEX "Product_sku_key"'), "Migration must create SKU unique index");
      assert.ok(migrationSql.includes('CREATE UNIQUE INDEX "Order_orderNumber_key"'), "Migration must create orderNumber unique index");
    });
  });

  describe("Task 5: Central Error Handler & 404 Middleware", () => {
    it("handles operational AppErrors with structured JSON response", () => {
      let statusCalled = 0;
      let jsonPayload: any = null;

      const mockRes = {
        headersSent: false,
        status: (code: number) => {
          statusCalled = code;
          return mockRes;
        },
        json: (data: any) => {
          jsonPayload = data;
          return mockRes;
        }
      } as any;

      const appError = new NotFoundError("Product with handle 'unknown' not found.");
      errorHandler(appError, {} as any, mockRes, (() => {}) as any);

      assert.strictEqual(statusCalled, 404);
      assert.strictEqual(jsonPayload.success, false);
      assert.strictEqual(jsonPayload.code, "NOT_FOUND");
      assert.strictEqual(jsonPayload.error, "Product with handle 'unknown' not found.");
    });

    it("handles 404 Not Found middleware with standard error payload", () => {
      let statusCalled = 0;
      let jsonPayload: any = null;

      const mockRes = {
        status: (code: number) => {
          statusCalled = code;
          return mockRes;
        },
        json: (data: any) => {
          jsonPayload = data;
          return mockRes;
        }
      } as any;

      const mockReq = {
        method: "GET",
        originalUrl: "/api/unknown-endpoint"
      } as any;

      notFoundHandler(mockReq, mockRes);

      assert.strictEqual(statusCalled, 404);
      assert.strictEqual(jsonPayload.success, false);
      assert.strictEqual(jsonPayload.code, "ROUTE_NOT_FOUND");
      assert.strictEqual(jsonPayload.error, "Route GET /api/unknown-endpoint not found.");
    });
  });

  describe("Task 7: Security Headers (Helmet) & CORS Configuration", () => {
    it("sets essential security headers and removes X-Powered-By", () => {
      const headers: Record<string, string> = {};
      let removedHeader = "";

      const mockRes = {
        setHeader: (name: string, val: string) => {
          headers[name] = val;
        },
        removeHeader: (name: string) => {
          removedHeader = name;
        }
      } as any;

      let nextCalled = false;
      const mw = securityHeaders();
      mw({} as any, mockRes, () => {
        nextCalled = true;
      });

      assert.strictEqual(nextCalled, true);
      assert.strictEqual(removedHeader, "X-Powered-By");
      assert.strictEqual(headers["X-Frame-Options"], "DENY");
      assert.strictEqual(headers["X-Content-Type-Options"], "nosniff");
      assert.strictEqual(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
      assert.ok(headers["Content-Security-Policy"].includes("default-src 'self'"));
      assert.ok(headers["Strict-Transport-Security"].includes("max-age="));
    });

    it("configures CORS allowlist with credentials support", () => {
      const corsOptions = getCorsOptions();
      assert.strictEqual(corsOptions.credentials, true);
      assert.strictEqual(typeof corsOptions.origin, "function");

      // Verify origin callback accepts allowed origins
      let allowedResult = false;
      (corsOptions.origin as any)("http://localhost:5173", (_err: any, allow: boolean) => {
        allowedResult = allow;
      });
      assert.strictEqual(allowedResult, true);
    });
  });

  describe("Task 8: Pagination Envelope Standard", () => {
    it("creates standard pagination envelope with hasNextPage and hasPrevPage flags", () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const total = 25;
      const page = 2;
      const pageSize = 10;

      const envelope = createPaginationEnvelope(data, total, page, pageSize);

      assert.strictEqual(envelope.page, 2);
      assert.strictEqual(envelope.pageSize, 10);
      assert.strictEqual(envelope.total, 25);
      assert.strictEqual(envelope.totalPages, 3);
      assert.strictEqual(envelope.hasNextPage, true);
      assert.strictEqual(envelope.hasPrevPage, true);
      assert.deepStrictEqual(envelope.data, data);
    });

    it("parses and bounds pagination parameters safely", () => {
      const normal = parsePaginationParams({ page: "3", pageSize: "15" });
      assert.strictEqual(normal.page, 3);
      assert.strictEqual(normal.pageSize, 15);
      assert.strictEqual(normal.skip, 30);
      assert.strictEqual(normal.take, 15);

      // Bounds max pageSize to 100
      const large = parsePaginationParams({ page: "1", pageSize: "500" });
      assert.strictEqual(large.pageSize, 100);

      // Handles invalid inputs with safe defaults
      const invalid = parsePaginationParams({ page: "-5", pageSize: "invalid" });
      assert.strictEqual(invalid.page, 1);
      assert.strictEqual(invalid.pageSize, 20);
    });
  });

  describe("Task 9: Database Health Check", () => {
    it("returns healthy status and metadata when database is connected", async () => {
      let statusCalled = 0;
      let jsonPayload: any = null;

      const mockRes = {
        status: (code: number) => {
          statusCalled = code;
          return mockRes;
        },
        json: (data: any) => {
          jsonPayload = data;
          return mockRes;
        }
      } as any;

      const origQueryRaw = (prisma as any).$queryRawUnsafe;
      (prisma as any).$queryRawUnsafe = async () => [{ 1: 1 }];

      try {
        await getHealthCheck({} as any, mockRes);

        assert.strictEqual(statusCalled, 200);
        assert.strictEqual(jsonPayload.status, "healthy");
        assert.strictEqual(jsonPayload.service, "Jabour Phone API");
        assert.strictEqual(jsonPayload.database.status, "connected");
        assert.strictEqual(typeof jsonPayload.database.latencyMs, "number");
        assert.strictEqual(typeof jsonPayload.uptimeSeconds, "number");
        assert.ok(jsonPayload.system.memory.heapUsed);
      } finally {
        (prisma as any).$queryRawUnsafe = origQueryRaw;
      }
    });
  });
});
