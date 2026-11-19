import { describe, it } from "node:test";
import assert from "node:assert";

function validateProductForm(data: {
  title: string;
  price: number;
  compare?: number | null;
  categoryId: number;
  brand: string;
  stock: number;
}) {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 2) {
    errors.title = "Product title must be at least 2 characters";
  }

  if (typeof data.price !== "number" || isNaN(data.price) || data.price <= 0) {
    errors.price = "Selling price must be greater than 0";
  }

  if (data.compare !== null && data.compare !== undefined) {
    if (data.compare <= data.price) {
      errors.compare = "Compare at price must be greater than selling price";
    }
  }

  if (!data.categoryId || data.categoryId <= 0) {
    errors.categoryId = "A valid category must be selected";
  }

  if (!data.brand || data.brand.trim().length === 0) {
    errors.brand = "Brand is required";
  }

  if (data.stock < 0) {
    errors.stock = "Stock cannot be negative";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateCategoryForm(data: { name: string; slug?: string }) {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Category name must be at least 2 characters";
  }

  if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = "Slug must contain only lowercase alphanumeric characters and hyphens";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateCouponForm(data: {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
}) {
  const errors: Record<string, string> = {};

  if (!data.code || !/^[A-Z0-9_-]{2,30}$/.test(data.code.trim().toUpperCase())) {
    errors.code = "Coupon code must be 2-30 alphanumeric characters";
  }

  if (data.discountValue <= 0) {
    errors.discountValue = "Discount value must be greater than 0";
  }

  if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
    errors.discountValue = "Percentage discount cannot exceed 100%";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

describe("Frontend Admin Forms Validation Test Suite", () => {
  describe("Product Form Validation", () => {
    it("validates a complete, valid product payload", () => {
      const valid = {
        title: "Apple iPhone 15 Pro Max 256GB",
        price: 1199,
        compare: 1299,
        categoryId: 1,
        brand: "Apple",
        stock: 12
      };

      const result = validateProductForm(valid);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(Object.keys(result.errors).length, 0);
    });

    it("rejects product form when compare price is less than or equal to selling price", () => {
      const invalid = {
        title: "Apple iPhone 15",
        price: 800,
        compare: 750, // invalid: compare must be > price
        categoryId: 1,
        brand: "Apple",
        stock: 5
      };

      const result = validateProductForm(invalid);
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.errors.compare, "Compare at price must be greater than selling price");
    });

    it("rejects product form when category or brand is missing", () => {
      const invalid = {
        title: "Generic Phone",
        price: 100,
        categoryId: 0,
        brand: "",
        stock: -1
      };

      const result = validateProductForm(invalid);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.categoryId);
      assert.ok(result.errors.brand);
      assert.ok(result.errors.stock);
    });
  });

  describe("Category Form Validation", () => {
    it("validates valid category name and kebab-case slug", () => {
      const valid = {
        name: "Flagship Smartphones",
        slug: "flagship-smartphones"
      };

      const result = validateCategoryForm(valid);
      assert.strictEqual(result.isValid, true);
    });

    it("rejects category slug with invalid special characters or uppercase", () => {
      const invalid = {
        name: "Flagship Smartphones",
        slug: "Flagship_Smartphones!"
      };

      const result = validateCategoryForm(invalid);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.slug);
    });
  });

  describe("Coupon Form Validation", () => {
    it("accepts valid percentage and fixed coupons", () => {
      const p = validateCouponForm({ code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10 });
      assert.strictEqual(p.isValid, true);

      const f = validateCouponForm({ code: "SAVE25", discountType: "FIXED", discountValue: 25 });
      assert.strictEqual(f.isValid, true);
    });

    it("rejects percentage coupon greater than 100%", () => {
      const invalid = validateCouponForm({ code: "CRAZY150", discountType: "PERCENTAGE", discountValue: 150 });
      assert.strictEqual(invalid.isValid, false);
      assert.strictEqual(invalid.errors.discountValue, "Percentage discount cannot exceed 100%");
    });
  });
});
