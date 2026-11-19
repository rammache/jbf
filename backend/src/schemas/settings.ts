import { z } from "zod";

export const updateStoreSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required").max(100),
  logo: z.string().nullable().optional(),
  phone: z.string().min(5, "Phone number is required").max(50),
  whatsapp: z.string().min(5, "WhatsApp number is required").max(50),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  currency: z.string().min(1, "Currency code is required").max(10),
  currencySymbol: z.string().min(1, "Currency symbol is required").max(5),
  shippingFee: z.number().min(0, "Shipping fee cannot be negative"),
  freeShippingThreshold: z.number().min(0, "Threshold cannot be negative"),
  announcement: z.string().max(255).default(""),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  twitter: z.string().nullable().optional(),
  workingHours: z.string().max(100).default("Mon - Sat: 9:00 AM - 8:00 PM"),
  aboutText: z.string().nullable().optional()
});

export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
