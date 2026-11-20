import { describe, it } from "node:test";
import assert from "node:assert";
import { prisma } from "../prisma.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  trackOrderSchema,
  orderStatusSchema,
  ORDER_STATUSES
} from "../schemas/order.js";
import { calculateShippingFee, calculateOrderTotals, STORE_CONFIG } from "../config/store.js";
import { generateUniqueOrderNumber } from "../utils/orderNumber.js";
import { createOrder, getOrder, trackOrder } from "../controllers/orderController.js";
import {
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
  adminCancelOrder,
  adminDeleteOrder
} from "../controllers/adminOrderController.js";
import {
  orderRateLimiter,
  newsletterRateLimiter
} from "../middleware/rateLimit.js";

describe("Phase 6 - Orders And Checkout", () => {
  describe("OrderStatus Enum & Zod Validation (Task #1, #2, #4)", () => {
    it("validates all 7 required OrderStatus enum values", () => {
      const required = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED"
      ];
      for (const s of required) {
        const res = orderStatusSchema.safeParse(s);
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.data, s);
      }
    });

    it("rejects legacy or invalid order status strings", () => {
      assert.strictEqual(orderStatusSchema.safeParse("PAID").success, false);
      assert.strictEqual(orderStatusSchema.safeParse("COMPLETED").success, false);
      assert.strictEqual(orderStatusSchema.safeParse("UNKNOWN").success, false);
    });

    it("validates valid createOrder payload with required phone and details", () => {
      const valid = {
        customerName: "Michel Aoun",
        customerEmail: "michel@example.com",
        customerPhone: "+961 71 234 567",
        customerAddress: "Sassine Square, Bldg 14",
        city: "Beirut",
        notes: "Ring bell 3",
        paymentMethod: "COD",
        items: [
          {
            productId: 1,
            title: "iPhone 15",
            selectedFinish: "Blue",
            quantity: 1,
            price: 999 // Client price is ignored on server
          }
        ]
      };
      const res = createOrderSchema.safeParse(valid);
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data?.customerPhone, "+961 71 234 567");
      assert.strictEqual(res.data?.city, "Beirut");
    });

    it("rejects createOrder when phone number is missing or too short", () => {
      const missingPhone = {
        customerName: "Michel Aoun",
        customerEmail: "michel@example.com",
        customerAddress: "Sassine Square",
        items: [{ productId: 1, quantity: 1 }]
      };
      const resMissing = createOrderSchema.safeParse(missingPhone);
      assert.strictEqual(resMissing.success, false);

      const shortPhone = {
        customerName: "Michel Aoun",
        customerEmail: "michel@example.com",
        customerPhone: "123", // too short
        customerAddress: "Sassine Square",
        items: [{ productId: 1, quantity: 1 }]
      };
      const resShort = createOrderSchema.safeParse(shortPhone);
      assert.strictEqual(resShort.success, false);
      assert.match(resShort.error?.issues[0]?.message || "", /at least 6 digits/i);
    });

    it("rejects createOrder with empty items array", () => {
      const emptyItems = {
        customerName: "Michel Aoun",
        customerEmail: "michel@example.com",
        customerPhone: "+961 71 234 567",
        customerAddress: "Sassine Square",
        items: []
      };
      const res = createOrderSchema.safeParse(emptyItems);
      assert.strictEqual(res.success, false);
    });
  });

  describe("Shipping Fee Rules & Calculations (Task #11)", () => {
    it("applies standard fee when subtotal is under threshold", () => {
      const fee = calculateShippingFee(STORE_CONFIG.freeShippingThreshold - 0.01);
      assert.strictEqual(fee, STORE_CONFIG.standardShippingFee);

      const totals = calculateOrderTotals(40);
      assert.strictEqual(totals.subtotal, 40);
      assert.strictEqual(totals.shippingFee, STORE_CONFIG.standardShippingFee);
      assert.strictEqual(totals.totalAmount, 40 + STORE_CONFIG.standardShippingFee);
    });

    it("applies free delivery when subtotal meets or exceeds threshold", () => {
      const feeAtThreshold = calculateShippingFee(STORE_CONFIG.freeShippingThreshold);
      assert.strictEqual(feeAtThreshold, 0);

      const feeOverThreshold = calculateShippingFee(1200);
      assert.strictEqual(feeOverThreshold, 0);

      const totals = calculateOrderTotals(1199);
      assert.strictEqual(totals.subtotal, 1199);
      assert.strictEqual(totals.shippingFee, 0);
      assert.strictEqual(totals.totalAmount, 1199);
    });
  });

  describe("Server-Side Price Recalculation & Stock Decrement (Task #5, #6)", () => {
    it("createOrder recalculates prices from DB and ignores client price tampering", async () => {
      const origFindUnique = prisma.product.findUnique;
      const origTransaction = prisma.$transaction;

      // Mock database product with real price of $800 and stock of 15
      (prisma.product as any).findUnique = async () => ({
        id: 10,
        title: "Genuine Phone",
        price: 800.0, // Authoritative DB price
        stock: 15,
        isActive: true,
        isArchived: false
      });

      let orderPayload: any = null;
      let decrementedQty: number = 0;

      (prisma as any).$transaction = async (fn: any) => {
        const mockTx = {
          product: {
            update: async (args: any) => {
              decrementedQty = args.data.stock.decrement;
              return {};
            }
          },
          order: {
            create: async (args: any) => {
              orderPayload = args.data;
              return { id: "order-test-uuid", ...args.data };
            }
          }
        };
        return fn(mockTx);
      };

      try {
        const req = {
          body: {
            customerName: "Client Tamperer",
            customerEmail: "tamper@example.com",
            customerPhone: "+961 70 999 888",
            customerAddress: "Main Street",
            city: "Beirut",
            paymentMethod: "COD",
            items: [
              {
                productId: 10,
                title: "Genuine Phone",
                quantity: 2,
                price: 1.0 // TAMPERED CLIENT PRICE! Should be ignored!
              }
            ]
          }
        } as any;

        let resJson: any = null;
        let resCode = 200;
        const res = {
          status: (c: number) => { resCode = c; return res; },
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await createOrder(req, res);

        assert.strictEqual(resCode, 201);
        assert.strictEqual(resJson.success, true);
        // Decremented 2 items
        assert.strictEqual(decrementedQty, 2);
        // Real price (800 * 2 = 1600), NOT client's $1 price!
        assert.strictEqual(orderPayload.subtotal, 1600);
        assert.strictEqual(orderPayload.shippingFee, 0); // >= 50 free delivery
        assert.strictEqual(orderPayload.totalAmount, 1600);
        assert.strictEqual(orderPayload.status, "PENDING");
        assert.strictEqual(orderPayload.items.create[0].price, 800);
        assert.match(orderPayload.orderNumber, /^JP-\d{4}-\d{4}$/);
      } finally {
        prisma.product.findUnique = origFindUnique;
        prisma.$transaction = origTransaction;
      }
    });

    it("createOrder applies $5 shipping fee when subtotal is under $50", async () => {
      const origFindUnique = prisma.product.findUnique;
      const origTransaction = prisma.$transaction;

      (prisma.product as any).findUnique = async () => ({
        id: 11,
        title: "Phone Case",
        price: 20.0,
        stock: 50,
        isActive: true,
        isArchived: false
      });

      let orderPayload: any = null;

      (prisma as any).$transaction = async (fn: any) => {
        const mockTx = {
          product: { update: async () => ({}) },
          order: {
            create: async (args: any) => {
              orderPayload = args.data;
              return { id: "order-case", ...args.data };
            }
          }
        };
        return fn(mockTx);
      };

      try {
        const req = {
          body: {
            customerName: "Jane Doe",
            customerEmail: "jane@example.com",
            customerPhone: "+961 70 111 222",
            customerAddress: "Beirut Souks",
            items: [{ productId: 11, quantity: 1, price: 20 }]
          }
        } as any;

        let resJson: any = null;
        const res = {
          status: () => res,
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await createOrder(req, res);

        assert.strictEqual(orderPayload.subtotal, 20);
        assert.strictEqual(orderPayload.shippingFee, STORE_CONFIG.standardShippingFee);
        assert.strictEqual(orderPayload.totalAmount, 20 + STORE_CONFIG.standardShippingFee);
      } finally {
        prisma.product.findUnique = origFindUnique;
        prisma.$transaction = origTransaction;
      }
    });
  });

  describe("Order Cancellation & Stock Restoration (Task #7)", () => {
    it("adminUpdateOrderStatus restores inventory when order is cancelled", async () => {
      const origFindUnique = prisma.order.findUnique;
      const origTransaction = prisma.$transaction;

      const mockOrder = {
        id: "order-101",
        orderNumber: "JP-2611-1001",
        status: "CONFIRMED",
        items: [
          { productId: 5, quantity: 2 },
          { productId: 6, quantity: 1 }
        ]
      };

      (prisma.order as any).findUnique = async () => mockOrder;

      const incremented: Array<{ id: number; qty: number }> = [];

      (prisma as any).$transaction = async (fn: any) => {
        const mockTx = {
          product: {
            update: async (args: any) => {
              incremented.push({
                id: args.where.id,
                qty: args.data.stock.increment
              });
              return {};
            }
          },
          order: {
            update: async (args: any) => ({
              ...mockOrder,
              status: args.data.status
            })
          }
        };
        return fn(mockTx);
      };

      try {
        const req = {
          params: { id: "order-101" },
          body: { status: "CANCELLED" }
        } as any;

        let resJson: any = null;
        const res = {
          status: () => res,
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await adminUpdateOrderStatus(req, res);

        assert.strictEqual(resJson.success, true);
        assert.strictEqual(resJson.data.status, "CANCELLED");
        assert.strictEqual(incremented.length, 2);
        assert.deepStrictEqual(incremented, [
          { id: 5, qty: 2 },
          { id: 6, qty: 1 }
        ]);
      } finally {
        prisma.order.findUnique = origFindUnique;
        prisma.$transaction = origTransaction;
      }
    });

    it("adminUpdateOrderStatus rejects re-activating cancelled order if insufficient stock", async () => {
      const origFindUnique = prisma.order.findUnique;
      const origTransaction = prisma.$transaction;

      const mockCancelledOrder = {
        id: "order-102",
        orderNumber: "JP-2611-1002",
        status: "CANCELLED",
        items: [{ productId: 5, quantity: 5 }]
      };

      (prisma.order as any).findUnique = async () => mockCancelledOrder;

      (prisma as any).$transaction = async (fn: any) => {
        const mockTx = {
          product: {
            findUnique: async () => ({
              id: 5,
              title: "Out Of Stock Phone",
              stock: 2 // Only 2 in stock, but order needs 5!
            }),
            update: async () => ({})
          },
          order: { update: async () => ({}) }
        };
        return fn(mockTx);
      };

      try {
        const req = {
          params: { id: "order-102" },
          body: { status: "CONFIRMED" }
        } as any;

        let resCode = 200;
        let resJson: any = null;
        const res = {
          status: (c: number) => { resCode = c; return res; },
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await adminUpdateOrderStatus(req, res);

        assert.strictEqual(resCode, 400);
        assert.strictEqual(resJson.success, false);
        assert.match(resJson.error, /insufficient stock/i);
      } finally {
        prisma.order.findUnique = origFindUnique;
        prisma.$transaction = origTransaction;
      }
    });
  });

  describe("Admin Orders API (Task #8)", () => {
    it("adminGetOrders returns orders list with pagination and status counts", async () => {
      const origFindMany = prisma.order.findMany;
      const origCount = prisma.order.count;
      const origAggregate = prisma.order.aggregate;

      (prisma.order as any).findMany = async () => [
        {
          id: "order-1",
          orderNumber: "JP-2611-1001",
          customerName: "Michel Aoun",
          totalAmount: 1199,
          status: "PENDING",
          items: []
        }
      ];

      (prisma.order as any).count = async () => 1;
      (prisma.order as any).aggregate = async () => ({
        _sum: { totalAmount: 1199 }
      });

      try {
        const req = { query: { page: "1", pageSize: "10" } } as any;
        let resJson: any = null;
        const res = {
          status: () => res,
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await adminGetOrders(req, res);

        assert.strictEqual(resJson.success, true);
        assert.strictEqual(resJson.data.length, 1);
        assert.strictEqual(resJson.page, 1);
        assert.strictEqual(resJson.total, 1);
        assert.ok(resJson.statusCounts);
        assert.strictEqual(resJson.totalRevenue, 1199);
      } finally {
        prisma.order.findMany = origFindMany;
        prisma.order.count = origCount;
        prisma.order.aggregate = origAggregate;
      }
    });

    it("adminGetOrderById returns 404 for non-existent order", async () => {
      const origFindFirst = prisma.order.findFirst;
      (prisma.order as any).findFirst = async () => null;

      try {
        const req = { params: { id: "non-existent" } } as any;
        let resCode = 200;
        let resJson: any = null;
        const res = {
          status: (c: number) => { resCode = c; return res; },
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await adminGetOrderById(req, res);

        assert.strictEqual(resCode, 404);
        assert.strictEqual(resJson.success, false);
      } finally {
        prisma.order.findFirst = origFindFirst;
      }
    });
  });

  describe("Order Reference & Security (Task #14, #15)", () => {
    it("generateUniqueOrderNumber produces format JP-YYMM-XXXX", async () => {
      const orderNumber = await generateUniqueOrderNumber();
      assert.match(orderNumber, /^JP-\d{4}-\d{4}$/);
    });

    it("getOrder protects private data and rejects unauthorized contact mismatch", async () => {
      const origFindFirst = prisma.order.findFirst;
      (prisma.order as any).findFirst = async () => ({
        id: "order-secret",
        orderNumber: "JP-2611-9999",
        customerEmail: "private@example.com",
        customerPhone: "+961 70 123 456",
        customerAddress: "Private Villa 4"
      });

      try {
        const req = {
          params: { id: "order-secret" },
          query: { contact: "wrong@hacker.com" }
        } as any;

        let resCode = 200;
        let resJson: any = null;
        const res = {
          status: (c: number) => { resCode = c; return res; },
          json: (d: any) => { resJson = d; return res; }
        } as any;

        await getOrder(req, res);

        assert.strictEqual(resCode, 403);
        assert.strictEqual(resJson.success, false);
      } finally {
        prisma.order.findFirst = origFindFirst;
      }
    });
  });

  describe("Rate Limiting Middleware (Task #13)", () => {
    it("orderRateLimiter and newsletterRateLimiter are defined functions", () => {
      assert.strictEqual(typeof orderRateLimiter, "function");
      assert.strictEqual(typeof newsletterRateLimiter, "function");
    });
  });
});
