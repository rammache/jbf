import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, error: "A valid email address is required" });
      return;
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email }
    });

    res.json({
      success: true,
      message: "Thank you for subscribing to Electro updates!",
      data: subscriber
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
