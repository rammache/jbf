import { Request, Response } from "express";
import { StoreSettings } from "@prisma/client";
import { prisma } from "../prisma.js";
import { updateStoreSettingsSchema } from "../schemas/settings.js";

const DEFAULT_SETTINGS = {
  id: 1,
  storeName: "Jabour Phone",
  logo: null as string | null,
  phone: "+961 70 123 456",
  whatsapp: "+961 70 123 456",
  email: "contact@jabourphone.com",
  address: "Beirut, Lebanon",
  city: "Beirut",
  country: "Lebanon",
  currency: "USD",
  currencySymbol: "$",
  shippingFee: 5.0,
  freeShippingThreshold: 50.0,
  announcement: "Free express delivery on orders over $50 | 100% Genuine phones guaranteed",
  workingHours: "Mon - Sat: 9:00 AM - 8:00 PM",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  twitter: "https://twitter.com",
  aboutText: "Jabour Phone is your trusted destination for genuine smartphones, premium accessories, and certified electronics in Lebanon."
};

export async function getOrCreateStoreSettings(): Promise<StoreSettings> {
  let settings = await prisma.storeSettings.findUnique({
    where: { id: 1 }
  });

  if (!settings) {
    try {
      settings = await prisma.storeSettings.create({
        data: DEFAULT_SETTINGS
      });
    } catch {
      // If concurrent request created it or DB error, fallback query
      settings = (await prisma.storeSettings.findFirst()) || ({
        ...DEFAULT_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date()
      } as unknown as StoreSettings);
    }
  }

  return settings;
}

export const getStoreSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateStoreSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to retrieve store settings";
    console.error("Failed to load store settings:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};

export const adminGetStoreSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateStoreSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to retrieve store settings";
    console.error("Admin failed to load store settings:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};

export const adminUpdateStoreSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = updateStoreSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid settings payload"
      });
      return;
    }

    const updated = await prisma.storeSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        ...parsed.data
      },
      update: parsed.data
    });

    res.json({
      success: true,
      message: "Store settings updated successfully",
      data: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update store settings";
    console.error("Failed to update store settings:", error);
    res.status(500).json({
      success: false,
      error: message
    });
  }
};
