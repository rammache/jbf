import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { adminOrdersQuerySchema, updateOrderStatusSchema, ORDER_STATUSES, OrderStatusType } from "../schemas/order.js";

/**
 * Admin: List all customer orders with filtering, search, pagination, and KPI counts.
 * GET /api/admin/orders
 */
export const adminGetOrders = async (req: Request, res: Response) => {
  try {
    const query = adminOrdersQuerySchema.parse(req.query);
    const { page, pageSize, status, search, sortBy, sortOrder } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q, mode: "insensitive" } }
      ];
    }

    const skip = (page - 1) * pageSize;

    const [orders, total, ...statusCountsRaw] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  images: true,
                  handle: true,
                  sku: true,
                  stock: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where }),
      // KPI counts for status tabs
      prisma.order.count(),
      ...ORDER_STATUSES.map((s) => prisma.order.count({ where: { status: s } })),
      // Revenue from active/completed orders
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { notIn: ["CANCELLED", "RETURNED"] }
        }
      })
    ]);

    const allCount = statusCountsRaw[0] as number;
    const statusCounts: Record<string, number> = { ALL: allCount };
    ORDER_STATUSES.forEach((s, idx) => {
      statusCounts[s] = (statusCountsRaw[idx + 1] as number) || 0;
    });

    const revenueAggregate = statusCountsRaw[statusCountsRaw.length - 1] as any;
    const totalRevenue = revenueAggregate?._sum?.totalAmount || 0;

    res.json({
      success: true,
      data: orders,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      statusCounts,
      totalRevenue: Math.round(totalRevenue * 100) / 100
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Get single order by ID or orderNumber with full item details.
 * GET /api/admin/orders/:id
 */
export const adminGetOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trimmed = String(id).trim();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: trimmed }, { orderNumber: trimmed }]
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                handle: true,
                sku: true,
                stock: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Update order status with stock transaction safety.
 * Restores inventory if transitioned to CANCELLED; re-decrements and checks stock if uncancelled.
 * PUT /api/admin/orders/:id/status
 */
export const adminUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = updateOrderStatusSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    const currentStatus = order.status;
    const targetStatus = status as OrderStatusType;

    // No-op if status is unchanged
    if (currentStatus === targetStatus) {
      res.json({
        success: true,
        message: `Order status is already ${targetStatus}`,
        data: order
      });
      return;
    }

    // Execute status transition and stock management atomically in transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. If transitioning TO CANCELLED and was not cancelled before -> Restore stock!
      if (targetStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity }
            }
          });
        }
      }

      // 2. If transitioning FROM CANCELLED back to an active state -> Check and re-decrement stock!
      if (currentStatus === "CANCELLED" && targetStatus !== "CANCELLED") {
        for (const item of order.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { id: true, title: true, stock: true }
          });

          if (!product || product.stock < item.quantity) {
            throw new Error(
              `Cannot reactivate order: insufficient stock for '${product?.title || "Product"}' (available: ${product?.stock || 0}, required: ${item.quantity}).`
            );
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity }
            }
          });
        }
      }

      // 3. Update the order status
      return tx.order.update({
        where: { id },
        data: { status: targetStatus },
        include: { items: true }
      });
    });

    res.json({
      success: true,
      message: `Order #${updatedOrder.orderNumber} status updated to ${targetStatus}`,
      data: updatedOrder
    });
  } catch (error: any) {
    res.status(error.message?.includes("insufficient stock") ? 400 : 500).json({
      success: false,
      error: error.message || "Failed to update order status"
    });
  }
};

/**
 * Admin: Shortcut endpoint to cancel an order and restore inventory.
 * POST /api/admin/orders/:id/cancel
 */
export const adminCancelOrder = async (req: Request, res: Response) => {
  req.body = { status: "CANCELLED" };
  return adminUpdateOrderStatus(req, res);
};

/**
 * Admin: Delete an order record.
 * If order was active (not already cancelled), restores stock before removing.
 * DELETE /api/admin/orders/:id
 */
export const adminDeleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      // If order was not cancelled, restore inventory before deletion
      if (order.status !== "CANCELLED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }

      // Delete order (cascade deletes order items)
      await tx.order.delete({
        where: { id }
      });
    });

    res.json({
      success: true,
      message: `Order #${order.orderNumber} deleted successfully`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
