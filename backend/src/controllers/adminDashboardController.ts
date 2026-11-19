import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const adminGetDashboardMetrics = async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // 1. Orders and Revenue
    const [
      ordersTodayCount,
      revenueTodayAgg,
      totalOrdersCount,
      totalRevenueAgg,
      pendingOrdersCount,
      lowStockProducts,
      outOfStockCount,
      subscriberCount,
      uniqueCustomersCount
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } }
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startOfToday },
          status: { not: "CANCELLED" }
        }
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } }
      }),
      prisma.order.count({
        where: { status: "PENDING" }
      }),
      prisma.product.findMany({
        where: {
          isArchived: false,
          stock: { lte: 5 } // threshold fallback
        },
        select: {
          id: true,
          title: true,
          handle: true,
          stock: true,
          lowStockThreshold: true,
          price: true
        },
        orderBy: { stock: "asc" },
        take: 10
      }),
      prisma.product.count({
        where: {
          isArchived: false,
          stock: { lte: 0 }
        }
      }),
      prisma.newsletterSubscriber.count(),
      prisma.order.groupBy({
        by: ["customerEmail"],
        _count: { customerEmail: true }
      }).then((rows) => rows.length)
    ]);

    // 2. Status counts
    const statusGroups = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true }
    });

    const statusCounts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      RETURNED: 0
    };

    statusGroups.forEach((g) => {
      statusCounts[g.status] = g._count.status;
    });

    // 3. Recent 8 orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
        createdAt: true
      }
    });

    // 4. Top Selling Products
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { status: { not: "CANCELLED" } }
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            handle: true,
            price: true,
            images: true
          }
        }
      }
    });

    const productSalesMap = new Map<number, {
      id: number;
      title: string;
      handle: string;
      price: number;
      image: string;
      unitsSold: number;
      totalRevenue: number;
    }>();

    for (const item of orderItems) {
      const p = item.product;
      if (!p) continue;

      const existing = productSalesMap.get(p.id) || {
        id: p.id,
        title: p.title,
        handle: p.handle,
        price: p.price,
        image: p.images?.[0] || "",
        unitsSold: 0,
        totalRevenue: 0
      };

      existing.unitsSold += item.quantity;
      existing.totalRevenue += item.price * item.quantity;
      productSalesMap.set(p.id, existing);
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // 5. Last 7 Days Revenue Trend
    const revenueTrend: Array<{ date: string; revenue: number; orders: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayOrders = await prisma.order.findMany({
        where: {
          createdAt: { gte: dayStart, lte: dayEnd },
          status: { not: "CANCELLED" }
        },
        select: { totalAmount: true }
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      revenueTrend.push({
        date: dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: Math.round(dayRevenue * 100) / 100,
        orders: dayOrders.length
      });
    }

    const metrics = {
      ordersToday: ordersTodayCount,
      revenueToday: revenueTodayAgg._sum.totalAmount || 0,
      totalOrders: totalOrdersCount,
      totalRevenue: totalRevenueAgg._sum.totalAmount || 0,
      pendingOrders: pendingOrdersCount,
      lowStockCount: lowStockProducts.length,
      outOfStockCount,
      subscriberCount,
      totalCustomers: uniqueCustomersCount,
      statusCounts,
      topProducts,
      lowStockProducts,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString()
      })),
      revenueTrend
    };

    return res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Dashboard metrics calculation failed:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to calculate dashboard metrics"
    });
  }
};

export const adminGetProfitReport = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      select: {
        id: true,
        title: true,
        handle: true,
        price: true,
        costPrice: true,
        supplier: true
      }
    });

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { status: { not: "CANCELLED" } }
      },
      select: {
        productId: true,
        quantity: true,
        price: true
      }
    });

    const productSales = new Map<number, { unitsSold: number; totalRevenue: number }>();
    for (const item of orderItems) {
      const curr = productSales.get(item.productId) || { unitsSold: 0, totalRevenue: 0 };
      curr.unitsSold += item.quantity;
      curr.totalRevenue += item.price * item.quantity;
      productSales.set(item.productId, curr);
    }

    let overallRevenue = 0;
    let overallCost = 0;

    const items = products.map((p) => {
      const sales = productSales.get(p.id) || { unitsSold: 0, totalRevenue: 0 };
      const cost = p.costPrice !== null && p.costPrice !== undefined ? p.costPrice : p.price * 0.7; // default 70% estimated cost if not set
      const totalItemCost = sales.unitsSold * cost;
      const totalItemProfit = sales.totalRevenue - totalItemCost;
      const unitProfit = p.price - cost;
      const marginPercent = p.price > 0 ? (unitProfit / p.price) * 100 : 0;

      overallRevenue += sales.totalRevenue;
      overallCost += totalItemCost;

      return {
        id: p.id,
        title: p.title,
        handle: p.handle,
        sellingPrice: p.price,
        costPrice: Math.round(cost * 100) / 100,
        unitProfit: Math.round(unitProfit * 100) / 100,
        marginPercent: Math.round(marginPercent * 10) / 10,
        unitsSold: sales.unitsSold,
        totalRevenue: Math.round(sales.totalRevenue * 100) / 100,
        totalCost: Math.round(totalItemCost * 100) / 100,
        totalProfit: Math.round(totalItemProfit * 100) / 100,
        supplier: p.supplier
      };
    });

    const grossProfit = overallRevenue - overallCost;
    const grossMarginPercent = overallRevenue > 0 ? (grossProfit / overallRevenue) * 100 : 0;

    return res.json({
      success: true,
      data: {
        totalRevenue: Math.round(overallRevenue * 100) / 100,
        totalCost: Math.round(overallCost * 100) / 100,
        grossProfit: Math.round(grossProfit * 100) / 100,
        grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
        items: items.sort((a, b) => b.totalProfit - a.totalProfit)
      }
    });
  } catch (error) {
    console.error("Failed to generate profit report:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to generate profit report"
    });
  }
};
