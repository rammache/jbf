import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, error: "A valid email address is required" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail }
    });

    res.json({
      success: true,
      message: "Thank you for subscribing to Jabour Phone updates!",
      data: subscriber
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const adminGetNewsletterSubscribers = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string, 10) || 20));
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (q) {
      where.email = { contains: q, mode: "insensitive" };
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: "desc" },
        skip,
        take: pageSize
      }),
      prisma.newsletterSubscriber.count({ where })
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return res.json({
      success: true,
      data: subscribers,
      page,
      pageSize,
      total,
      totalPages
    });
  } catch (error) {
    console.error("Failed to load newsletter subscribers:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to retrieve newsletter subscribers"
    });
  }
};

export const adminExportNewsletterCsv = async (_req: Request, res: Response) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" }
    });

    const header = "ID,Email,Subscribed At\n";
    const rows = subscribers
      .map((s) => `${s.id},"${s.email.replace(/"/g, '""')}","${s.subscribedAt.toISOString()}"`)
      .join("\n");

    const csvContent = header + rows;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="newsletter_subscribers.csv"'
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("Failed to export newsletter subscribers to CSV:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to export newsletter subscribers"
    });
  }
};

export const adminDeleteNewsletterSubscriber = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: "Invalid subscriber ID" });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!subscriber) {
      return res.status(404).json({ success: false, error: "Subscriber not found" });
    }

    await prisma.newsletterSubscriber.delete({ where: { id } });

    return res.json({
      success: true,
      message: `Subscriber "${subscriber.email}" removed successfully`
    });
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to delete subscriber"
    });
  }
};
