import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerEmail, customerName, customerAddress, items } = req.body;

    if (!customerEmail || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: "Invalid order details" });
      return;
    }

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += (item.price || 0) * (item.quantity || 1);
    }

    const order = await prisma.order.create({
      data: {
        customerEmail,
        customerName,
        customerAddress: customerAddress || "N/A",
        totalAmount,
        status: "COMPLETED",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productTitle: item.title,
            selectedFinish: item.selectedFinish || null,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
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

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
