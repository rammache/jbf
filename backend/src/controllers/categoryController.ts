import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import {
  generateUniqueCategorySlug,
  resolveCategorySlugOnUpdate
} from "../utils/slug.js";

/**
 * Public: Get active categories ordered by sortOrder then name.
 * GET /api/categories
 */
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch categories." });
  }
};

/**
 * Admin: Get all categories (active and inactive) ordered by sortOrder then id.
 * GET /api/admin/categories
 */
export const adminGetCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch admin categories." });
  }
};

/**
 * Admin: Get single category by ID.
 * GET /api/admin/categories/:id
 */
export const adminGetCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ success: false, error: "Invalid category ID." });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      res.status(404).json({ success: false, error: "Category not found." });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch category." });
  }
};

/**
 * Admin: Create a new category with auto-slug generation.
 * POST /api/admin/categories
 */
export const adminCreateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, image, sortOrder, isActive } = req.body;

    // Check duplicate name (case-insensitive)
    const existingName = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" }
      }
    });

    if (existingName) {
      res.status(400).json({
        success: false,
        error: `A category with the name "${name}" already exists.`
      });
      return;
    }

    // Auto-generate unique slug or resolve custom slug
    const finalSlug = await generateUniqueCategorySlug({
      name,
      customSlug: slug
    });

    // Determine sort order if not explicitly specified
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined || finalSortOrder === null) {
      const maxOrderCat = await prisma.category.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true }
      });
      finalSortOrder = maxOrderCat ? maxOrderCat.sortOrder + 1 : 0;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description ?? null,
        image: image ?? null,
        sortOrder: finalSortOrder,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to create category." });
  }
};

/**
 * Admin: Update category with rename slug stability.
 * PUT /api/admin/categories/:id
 */
export const adminUpdateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ success: false, error: "Invalid category ID." });
      return;
    }

    const currentCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!currentCategory) {
      res.status(404).json({ success: false, error: "Category not found." });
      return;
    }

    const { name, slug, description, image, sortOrder, isActive, regenerateSlug } = req.body;

    // Check duplicate name if name changed
    if (name && name.toLowerCase() !== currentCategory.name.toLowerCase()) {
      const duplicateName = await prisma.category.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          id: { not: id }
        }
      });

      if (duplicateName) {
        res.status(400).json({
          success: false,
          error: `Another category with the name "${name}" already exists.`
        });
        return;
      }
    }

    // Resolve slug respecting rename stability
    const finalSlug = await resolveCategorySlugOnUpdate({
      currentCategory,
      newName: name,
      newSlug: slug,
      regenerateSlug: Boolean(regenerateSlug)
    });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        slug: finalSlug,
        ...(description !== undefined ? { description: description || null } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        ...(isActive !== undefined ? { isActive } : {})
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update category." });
  }
};

/**
 * Admin: Delete category with product block / reassign enforcement.
 * DELETE /api/admin/categories/:id
 */
export const adminDeleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ success: false, error: "Invalid category ID." });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      res.status(404).json({ success: false, error: "Category not found." });
      return;
    }

    const productCount = category._count.products;

    if (productCount > 0) {
      const rawReassign = req.body?.reassignToCategoryId ?? (req.query?.reassignTo ? Number(req.query.reassignTo) : undefined);
      const reassignToCategoryId = rawReassign !== undefined && rawReassign !== null ? Number(rawReassign) : undefined;

      if (!reassignToCategoryId || isNaN(reassignToCategoryId)) {
        res.status(409).json({
          success: false,
          error: `Cannot delete category "${category.name}" because it still contains ${productCount} product(s). Please reassign products to another category first.`,
          productCount,
          canReassign: true
        });
        return;
      }

      if (reassignToCategoryId === id) {
        res.status(400).json({
          success: false,
          error: "Cannot reassign products to the same category being deleted."
        });
        return;
      }

      const targetCategory = await prisma.category.findUnique({
        where: { id: reassignToCategoryId }
      });

      if (!targetCategory) {
        res.status(404).json({
          success: false,
          error: "Reassignment target category not found."
        });
        return;
      }

      // Reassign products and delete category atomically
      await prisma.$transaction([
        prisma.product.updateMany({
          where: { categoryId: id },
          data: { categoryId: reassignToCategoryId }
        }),
        prisma.category.delete({
          where: { id }
        })
      ]);

      res.json({
        success: true,
        message: `Category "${category.name}" deleted and ${productCount} product(s) reassigned to "${targetCategory.name}".`,
        reassignedCount: productCount
      });
      return;
    }

    // No products, safe to delete immediately
    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to delete category." });
  }
};

/**
 * Admin: Batch reorder categories.
 * PUT /api/admin/categories/reorder
 */
export const adminReorderCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orders } = req.body as { orders: Array<{ id: number; sortOrder: number }> };

    if (!Array.isArray(orders) || orders.length === 0) {
      res.status(400).json({ success: false, error: "Orders array must not be empty." });
      return;
    }

    await prisma.$transaction(
      orders.map(({ id, sortOrder }) =>
        prisma.category.update({
          where: { id },
          data: { sortOrder }
        })
      )
    );

    res.json({
      success: true,
      message: "Categories reordered successfully."
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to reorder categories." });
  }
};
