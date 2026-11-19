import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, q, minPrice, maxPrice, sort, featured } = req.query;

    const where: any = {};

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

    let orderBy: any = { id: "asc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating-desc") orderBy = { rating: "desc" };
    else if (sort === "title-asc") orderBy = { title: "asc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      count: products.length,
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

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Also fetch 4 related products in the same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        handle: { not: handle }
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
      select: { brand: true },
      distinct: ["brand"]
    });
    const brands = products.map((p: { brand: string }) => p.brand);
    res.json({ success: true, data: brands });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
