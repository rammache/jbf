import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
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
import { toNumber } from "../utils/decimal.js";
import { createPaginationEnvelope } from "../utils/pagination.js";

/**
 * GET /api/admin/products
 * List products with search, filtering, sorting, pagination, and KPI counts.
 */
export async function adminGetProducts(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit || "20"), 10) || 20));
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const categoryId = req.query.categoryId ? parseInt(String(req.query.categoryId), 10) : undefined;
    const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status.trim() : "all";
    const isFeatured = req.query.isFeatured !== undefined ? req.query.isFeatured === "true" : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy.trim() : "createdAt";
    const sortOrder: Prisma.SortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { handle: { contains: search, mode: "insensitive" } }
      ];
    }

    if (categoryId && !isNaN(categoryId)) {
      where.categoryId = categoryId;
    }

    if (brand) {
      where.brand = { equals: brand, mode: "insensitive" };
    }

    if (isFeatured !== undefined) {
      where.OR = [{ isFeatured }, { featured: isFeatured }];
    }

    // Status filter
    if (status === "active") {
      where.isActive = true;
      where.isArchived = false;
    } else if (status === "draft") {
      where.isActive = false;
      where.isArchived = false;
    } else if (status === "archived") {
      where.isArchived = true;
    } else if (status === "low_stock") {
      where.isArchived = false;
      where.stock = { gt: 0, lte: 5 };
    } else if (status === "out_of_stock") {
      where.isArchived = false;
      where.stock = { lte: 0 };
    } else {
      // Default: hide archived products from the main table unless explicitly requested
      if (status !== "with_archived") {
        where.isArchived = false;
      }
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: sortOrder };
    if (sortBy === "price") {
      orderBy = { price: sortOrder };
    } else if (sortBy === "stock") {
      orderBy = { stock: sortOrder };
    } else if (sortBy === "title") {
      orderBy = { title: sortOrder };
    }

    const skip = (page - 1) * limit;

    const [products, total, totalAll, totalActive, totalLowStock, totalOutOfStock] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          _count: {
            select: { orderItems: true }
          }
        }
      }),
      prisma.product.count({ where }),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.product.count({ where: { isArchived: false, isActive: true } }),
      prisma.product.count({ where: { isArchived: false, stock: { gt: 0, lte: 5 } } }),
      prisma.product.count({ where: { isArchived: false, stock: { lte: 0 } } })
    ]);

    const envelope = createPaginationEnvelope(products, total, page, limit);

    res.json({
      success: true,
      data: products,
      products,
      page: envelope.page,
      pageSize: envelope.pageSize,
      total: envelope.total,
      totalPages: envelope.totalPages,
      hasNextPage: envelope.hasNextPage,
      hasPrevPage: envelope.hasPrevPage,
      pagination: {
        page: envelope.page,
        limit: envelope.pageSize,
        total: envelope.total,
        totalPages: envelope.totalPages
      },
      kpis: {
        total: totalAll,
        active: totalActive,
        lowStock: totalLowStock,
        outOfStock: totalOutOfStock
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve products";
    console.error("adminGetProducts error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * GET /api/admin/products/:id
 */
export async function adminGetProductById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product ID" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    res.json({ success: true, product, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch product";
    console.error("adminGetProductById error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * POST /api/admin/products
 */
export async function adminCreateProduct(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
        details: parsed.error.issues
      });
      return;
    }

    const data = parsed.data;

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });
    if (!category) {
      res.status(404).json({ success: false, error: "Selected category does not exist" });
      return;
    }

    // Check SKU collision if SKU provided
    if (data.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku }
      });
      if (existingSku) {
        res.status(409).json({ success: false, error: `SKU '${data.sku}' is already assigned to another product.` });
        return;
      }
    }

    // Auto-generate unique handle
    const handle = await generateUniqueProductHandle({
      title: data.title,
      customHandle: data.handle
    });

    const product = await prisma.product.create({
      data: {
        title: data.title,
        handle,
        price: data.price,
        compare: data.compare ?? null,
        categoryId: data.categoryId,
        brand: data.brand,
        sku: data.sku ?? null,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        description: data.description ?? null,
        spec: data.spec || `${data.brand} ${data.storage ? data.storage + " · " : ""}${data.color || ""}`.trim(),
        screen: data.screen ?? null,
        battery: data.battery ?? null,
        camera: data.camera ?? null,
        network: data.network ?? null,
        warranty: data.warranty ?? null,
        processor: data.processor ?? null,
        condition: data.condition,
        storage: data.storage ?? null,
        ram: data.ram ?? null,
        color: data.color ?? null,
        costPrice: data.costPrice ?? null,
        supplier: data.supplier ?? null,
        finishes: data.finishes,
        images: data.images,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        featured: data.isFeatured // sync legacy field
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
      data: product
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    console.error("adminCreateProduct error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * PUT /api/admin/products/:id
 */
export async function adminUpdateProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product ID" });
      return;
    }

    const currentProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!currentProduct) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
        details: parsed.error.issues
      });
      return;
    }

    const data = parsed.data;

    // Check compare > price against current or updated price
    const currentPriceNum = toNumber(currentProduct.price);
    const currentCompareNum = currentProduct.compare ? toNumber(currentProduct.compare) : null;

    const effectivePrice = data.price !== undefined ? data.price : currentPriceNum;
    const effectiveCompare = data.compare !== undefined ? data.compare : currentCompareNum;
    if (effectiveCompare !== null && effectiveCompare !== undefined && effectiveCompare <= effectivePrice) {
      res.status(400).json({
        success: false,
        error: "Compare at price must be greater than the selling price"
      });
      return;
    }

    // Verify category exists if updated
    if (data.categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });
      if (!category) {
        res.status(404).json({ success: false, error: "Selected category does not exist" });
        return;
      }
    }

    // Check SKU collision if SKU updated
    if (data.sku !== undefined && data.sku !== null && data.sku !== currentProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku }
      });
      if (existingSku && existingSku.id !== id) {
        res.status(409).json({ success: false, error: `SKU '${data.sku}' is already in use by another product.` });
        return;
      }
    }

    // Resolve handle with rename stability
    const handle = await resolveProductHandleOnUpdate({
      currentProduct: {
        id: currentProduct.id,
        handle: currentProduct.handle,
        title: currentProduct.title
      },
      newTitle: data.title,
      newHandle: data.handle,
      regenerateHandle: data.regenerateHandle
    });

    const isFeatured = data.isFeatured !== undefined ? data.isFeatured : currentProduct.isFeatured;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        handle,
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.compare !== undefined ? { compare: data.compare } : {}),
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
        ...(data.brand !== undefined ? { brand: data.brand } : {}),
        ...(data.sku !== undefined ? { sku: data.sku } : {}),
        ...(data.stock !== undefined ? { stock: data.stock } : {}),
        ...(data.lowStockThreshold !== undefined ? { lowStockThreshold: data.lowStockThreshold } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.spec !== undefined ? { spec: data.spec } : {}),
        ...(data.screen !== undefined ? { screen: data.screen } : {}),
        ...(data.battery !== undefined ? { battery: data.battery } : {}),
        ...(data.camera !== undefined ? { camera: data.camera } : {}),
        ...(data.network !== undefined ? { network: data.network } : {}),
        ...(data.warranty !== undefined ? { warranty: data.warranty } : {}),
        ...(data.processor !== undefined ? { processor: data.processor } : {}),
        ...(data.condition !== undefined ? { condition: data.condition } : {}),
        ...(data.storage !== undefined ? { storage: data.storage } : {}),
        ...(data.ram !== undefined ? { ram: data.ram } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
        ...(data.costPrice !== undefined ? { costPrice: data.costPrice } : {}),
        ...(data.supplier !== undefined ? { supplier: data.supplier } : {}),
        ...(data.finishes !== undefined ? { finishes: data.finishes } : {}),
        ...(data.images !== undefined ? { images: data.images } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured, featured: data.isFeatured } : {}),
        ...(data.isArchived !== undefined ? { isArchived: data.isArchived } : {})
      },
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
      data: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    console.error("adminUpdateProduct error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * DELETE /api/admin/products/:id
 * Implements Archive/Delete rules:
 * - If product has past orders: soft-delete (archive) to preserve order history.
 * - If product has 0 orders: permanently delete from database.
 */
export async function adminDeleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product ID" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    const orderCount = product._count.orderItems;

    if (orderCount > 0) {
      // Soft-delete / Archive product
      await prisma.product.update({
        where: { id },
        data: {
          isArchived: true,
          isActive: false
        }
      });

      res.json({
        success: true,
        archived: true,
        deleted: false,
        message: `Product has ${orderCount} past order(s). It was safely archived instead of permanently deleted to preserve customer order history.`
      });
      return;
    }

    // Hard-delete when 0 orders exist
    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      archived: false,
      deleted: true,
      message: "Product permanently deleted."
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    console.error("adminDeleteProduct error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * POST /api/admin/products/:id/duplicate
 * Clones a product into a new draft product with unique handle.
 */
export async function adminDuplicateProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product ID" });
      return;
    }

    const original = await prisma.product.findUnique({
      where: { id }
    });

    if (!original) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    const copyTitle = `${original.title} (Copy)`;
    const copyHandle = await generateUniqueProductHandle({
      title: copyTitle
    });

    const duplicated = await prisma.product.create({
      data: {
        title: copyTitle,
        handle: copyHandle,
        price: original.price,
        compare: original.compare,
        categoryId: original.categoryId,
        brand: original.brand,
        sku: original.sku ? `${original.sku}-COPY` : null,
        stock: original.stock,
        lowStockThreshold: original.lowStockThreshold,
        description: original.description,
        spec: original.spec,
        screen: original.screen,
        battery: original.battery,
        camera: original.camera,
        network: original.network,
        warranty: original.warranty,
        processor: original.processor,
        condition: original.condition,
        storage: original.storage,
        ram: original.ram,
        color: original.color,
        finishes: original.finishes,
        images: original.images,
        rating: 5.0,
        reviews: 0,
        isActive: false, // Start as draft so admin can adjust
        isFeatured: false,
        featured: false,
        isArchived: false
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Product duplicated successfully as draft",
      product: duplicated,
      data: duplicated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to duplicate product";
    console.error("adminDuplicateProduct error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * POST /api/admin/products/bulk
 * Perform bulk operations (activate, deactivate, archive, delete).
 */
export async function adminBulkProductActions(req: Request, res: Response): Promise<void> {
  try {
    const parsed = bulkProductActionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed"
      });
      return;
    }

    const { ids, action } = parsed.data;

    if (action === "activate") {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true, isArchived: false }
      });
      res.json({ success: true, message: `${ids.length} product(s) activated.` });
      return;
    }

    if (action === "deactivate") {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false }
      });
      res.json({ success: true, message: `${ids.length} product(s) deactivated.` });
      return;
    }

    if (action === "archive") {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isArchived: true, isActive: false }
      });
      res.json({ success: true, message: `${ids.length} product(s) archived.` });
      return;
    }

    if (action === "delete") {
      // Find which products have orders
      const productsWithOrders = await prisma.product.findMany({
        where: {
          id: { in: ids },
          orderItems: { some: {} }
        },
        select: { id: true }
      });

      const orderProductIds = new Set(productsWithOrders.map((p) => p.id));
      const deleteIds = ids.filter((id) => !orderProductIds.has(id));
      const archiveIds = ids.filter((id) => orderProductIds.has(id));

      if (deleteIds.length > 0) {
        await prisma.product.deleteMany({
          where: { id: { in: deleteIds } }
        });
      }

      if (archiveIds.length > 0) {
        await prisma.product.updateMany({
          where: { id: { in: archiveIds } },
          data: { isArchived: true, isActive: false }
        });
      }

      res.json({
        success: true,
        deletedCount: deleteIds.length,
        archivedCount: archiveIds.length,
        message: `${deleteIds.length} product(s) permanently deleted, ${archiveIds.length} archived (due to existing customer orders).`
      });
      return;
    }

    res.status(400).json({ success: false, error: "Invalid action" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to perform bulk action";
    console.error("adminBulkProductActions error:", error);
    res.status(500).json({ success: false, error: message });
  }
}

/**
 * POST /api/admin/upload
 * Multi-file image upload endpoint.
 */
export async function adminUploadImages(req: Request, res: Response): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const singleFile = req.file as Express.Multer.File | undefined;

    const uploadedFiles = files && files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (uploadedFiles.length === 0) {
      res.status(400).json({ success: false, error: "No image files provided" });
      return;
    }

    const urls = uploadedFiles.map((file) => `/uploads/${file.filename}`);

    res.json({
      success: true,
      message: `${urls.length} image(s) uploaded successfully`,
      urls,
      url: urls[0]
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload images";
    console.error("adminUploadImages error:", error);
    res.status(500).json({ success: false, error: message });
  }
}
