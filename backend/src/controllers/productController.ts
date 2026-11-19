import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, q, minPrice, maxPrice, sort, featured, page, limit } = req.query;

    const where: any = {
      isActive: true,
      isArchived: false
    };

    if (category && typeof category === "string") {
      where.category = {
        OR: [
          { name: { equals: category, mode: "insensitive" } },
          { slug: { equals: category, mode: "insensitive" } }
        ]
      };
    }

    if (brand && typeof brand === "string") {
      where.brand = {
        equals: brand,
        mode: "insensitive"
      };
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (q && typeof q === "string") {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { spec: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } }
      ];
    }

    let orderBy: any = [{ isFeatured: "desc" }, { featured: "desc" }, { createdAt: "desc" }, { id: "asc" }];
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating-desc") orderBy = [{ rating: "desc" }, { reviews: "desc" }];
    else if (sort === "title-asc") orderBy = { title: "asc" };
    else if (sort === "featured" || sort === "featured-bench") orderBy = [{ isFeatured: "desc" }, { featured: "desc" }, { createdAt: "desc" }, { id: "asc" }];

    // Optional pagination
    const pageNum = page ? Math.max(1, parseInt(String(page), 10) || 1) : null;
    const limitNum = limit ? Math.max(1, Math.min(100, parseInt(String(limit), 10) || 12)) : null;

    let total = 0;
    let products: any[] = [];

    if (pageNum && limitNum) {
      const [fetchedProducts, count] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          include: {
            category: true
          },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        }),
        typeof prisma.product.count === "function"
          ? prisma.product.count({ where })
          : Promise.resolve(0)
      ]);
      products = fetchedProducts;
      total = count;
    } else {
      products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true
        }
      });
      total = products.length;
    }

    const totalPages = limitNum ? Math.ceil(total / limitNum) || 1 : 1;

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum || 1,
      totalPages,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    const product = await prisma.product.findUnique({
      where: { handle },
      include: {
        category: true
      }
    });

    if (!product || product.isArchived || product.isActive === false) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Also fetch 4 related products in the same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        handle: { not: handle },
        isActive: true,
        isArchived: false
      },
      include: {
        category: true
      },
      take: 4
    });

    res.json({
      success: true,
      data: product,
      related
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isArchived: false
      },
      select: { brand: true },
      distinct: ["brand"]
    });
    const brands = products.map((p: { brand: string }) => p.brand);
    res.json({ success: true, data: brands });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
