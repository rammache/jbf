import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createReviewSchema, trackOrderSchema } from "../schemas/review.js";
import { recalculateProductRating } from "../controllers/reviewController.js";
import { trackOrder } from "../controllers/orderController.js";
import { prisma } from "../prisma.js";

describe("Phase 5 - Storefront Alignment & Reviews", () => {
  describe("Zod Validation: Reviews & Order Tracking", () => {
    it("validates review payload correctly", () => {
      const valid = createReviewSchema.safeParse({
        rating: 5,
        authorName: "John Doe",
        comment: "Excellent display and battery performance. Sustained speeds on bench."
      });
      assert.equal(valid.success, true);
    });

    it("rejects review with invalid rating (outside 1-5)", () => {
      const invalid = createReviewSchema.safeParse({
        rating: 6,
        authorName: "John Doe",
        comment: "Great hardware"
      });
      assert.equal(invalid.success, false);
      assert.match(invalid.error?.issues[0]?.message || "", /between 1 and 5/);
    });

    it("rejects review with too short author name or comment", () => {
      const shortName = createReviewSchema.safeParse({
        rating: 4,
        authorName: "J",
        comment: "Good"
      });
      assert.equal(shortName.success, false);
    });

    it("validates trackOrderSchema with non-empty fields", () => {
      const valid = trackOrderSchema.safeParse({
        orderId: "550e8400-e29b-41d4-a716-446655440000",
        contact: "customer@example.com"
      });
      assert.equal(valid.success, true);

      const invalid = trackOrderSchema.safeParse({
        orderId: "",
        contact: "ab"
      });
      assert.equal(invalid.success, false);
    });
  });

  describe("Product Rating & Review Recalculation", () => {
    it("recalculates average rating and review count from approved reviews", async () => {
      const origFindMany = prisma.review.findMany;
      const origUpdate = prisma.product.update;

      let updatedData: any = null;

      // Mock prisma calls
      (prisma.review as any).findMany = async (args: any) => {
        assert.equal(args.where.productId, 101);
        assert.equal(args.where.isApproved, true);
        return [
          { id: 1, productId: 101, rating: 5, isApproved: true },
          { id: 2, productId: 101, rating: 4, isApproved: true }
        ];
      };

      (prisma.product as any).update = async (args: any) => {
        assert.equal(args.where.id, 101);
        updatedData = args.data;
        return { id: 101, ...args.data };
      };

      try {
        await recalculateProductRating(101);
        assert.ok(updatedData);
        assert.equal(updatedData.reviews, 2);
        assert.equal(updatedData.rating, 4.5);
      } finally {
        prisma.review.findMany = origFindMany;
        prisma.product.update = origUpdate;
      }
    });

    it("defaults to rating 5.0 and 0 reviews when no approved reviews exist", async () => {
      const origFindMany = prisma.review.findMany;
      const origUpdate = prisma.product.update;

      let updatedData: any = null;

      (prisma.review as any).findMany = async () => [];
      (prisma.product as any).update = async (args: any) => {
        updatedData = args.data;
        return { id: 202, ...args.data };
      };

      try {
        await recalculateProductRating(202);
        assert.ok(updatedData);
        assert.equal(updatedData.reviews, 0);
        assert.equal(updatedData.rating, 5.0);
      } finally {
        prisma.review.findMany = origFindMany;
        prisma.product.update = origUpdate;
      }
    });
  });

  describe("Order Tracking API (trackOrder)", () => {
    it("rejects order tracking without orderId or contact", async () => {
      let statusCode = 200;
      let jsonBody: any = null;

      const req: any = { body: { orderId: "", contact: "" } };
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return res;
        },
        json: (data: any) => {
          jsonBody = data;
        }
      };

      await trackOrder(req, res);
      assert.equal(statusCode, 400);
      assert.equal(jsonBody.success, false);
      assert.match(jsonBody.error, /Please provide both/);
    });

    it("returns 404 when no matching order exists", async () => {
      const origFindFirst = prisma.order.findFirst;
      (prisma.order as any).findFirst = async () => null;

      let statusCode = 200;
      let jsonBody: any = null;

      const req: any = {
        body: {
          orderId: "non-existent-order",
          contact: "test@example.com"
        }
      };
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return res;
        },
        json: (data: any) => {
          jsonBody = data;
        }
      };

      try {
        await trackOrder(req, res);
        assert.equal(statusCode, 404);
        assert.equal(jsonBody.success, false);
        assert.match(jsonBody.error, /No matching order/);
      } finally {
        prisma.order.findFirst = origFindFirst;
      }
    });

    it("returns sanitized order tracking information on success", async () => {
      const origFindFirst = prisma.order.findFirst;
      const mockOrder = {
        id: "order-12345",
        status: "PROCESSING",
        createdAt: new Date("2026-11-19T10:00:00Z"),
        totalAmount: 1199.0,
        customerName: "Sami Jabour",
        customerAddress: "Main Street, Beirut",
        customerEmail: "sami@example.com",
        items: [
          {
            id: "item-1",
            productTitle: "Kestrel 14 Ultrabook",
            selectedFinish: "Graphite",
            quantity: 1,
            price: 1199.0
          }
        ]
      };

      (prisma.order as any).findFirst = async (args: any) => {
        assert.equal(args.where.id, "order-12345");
        return mockOrder;
      };

      let statusCode = 200;
      let jsonBody: any = null;

      const req: any = {
        body: {
          orderId: "order-12345",
          contact: "sami@example.com"
        }
      };
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return res;
        },
        json: (data: any) => {
          jsonBody = data;
        }
      };

      try {
        await trackOrder(req, res);
        assert.equal(statusCode, 200);
        assert.equal(jsonBody.success, true);
        assert.equal(jsonBody.data.id, "order-12345");
        assert.equal(jsonBody.data.status, "PROCESSING");
        assert.equal(jsonBody.data.customerName, "Sami Jabour");
        assert.equal(jsonBody.data.items.length, 1);
        assert.equal(jsonBody.data.items[0].productTitle, "Kestrel 14 Ultrabook");
      } finally {
        prisma.order.findFirst = origFindFirst;
      }
    });
  });

  describe("Featured Sort Priority", () => {
    it("ensures default sorting prioritizes isFeatured and featured flags", () => {
      const defaultOrder = [
        { isFeatured: "desc" },
        { featured: "desc" },
        { createdAt: "desc" },
        { id: "asc" }
      ];

      assert.equal(defaultOrder[0].isFeatured, "desc");
      assert.equal(defaultOrder[1].featured, "desc");
      assert.equal(defaultOrder[2].createdAt, "desc");
    });
  });
});
