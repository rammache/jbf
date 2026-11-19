import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

/**
 * Production Safe Seed Script
 * - Sets up initial StoreSettings singleton.
 * - Creates standard base product categories.
 * - Creates the initial Super Admin account if no admin accounts exist.
 * - Does NOT create demo products (demo products are isolated in prisma/demo-seed.ts).
 */
async function main() {
  console.log("==================================================");
  console.log("🌱 Running Jabour Phone Safe Production Seed");
  console.log("==================================================");

  // 1. Initialize StoreSettings
  console.log("1. Checking StoreSettings...");
  const existingSettings = await prisma.storeSettings.findFirst();
  if (!existingSettings) {
    await prisma.storeSettings.create({
      data: {
        storeName: "Jabour Phone",
        phone: "+961 70 123 456",
        whatsapp: "+961 70 123 456",
        email: "contact@jabourphone.com",
        address: "Main Commercial Street, Hamra District",
        city: "Beirut",
        country: "Lebanon",
        currency: "USD",
        currencySymbol: "$",
        shippingFee: new Prisma.Decimal("5.00"),
        freeShippingThreshold: new Prisma.Decimal("50.00"),
        workingHours: "Mon - Sat: 9:00 AM - 8:00 PM",
        announcement: "🚚 Fast Courier Delivery Across All Lebanon | 100% Genuine Guaranteed",
        aboutText:
          "Jabour Phone is Beirut's trusted smartphone and electronics destination, providing genuine devices, official warranties, and dedicated customer service.",
        facebook: "https://facebook.com/jabourphone",
        instagram: "https://instagram.com/jabourphone",
        tiktok: "https://tiktok.com/@jabourphone"
      }
    });
    console.log("   ✓ Default StoreSettings created.");
  } else {
    console.log("   ✓ StoreSettings already present.");
  }

  // 2. Initialize Real Base Categories
  console.log("2. Initializing standard categories...");
  const baseCategories = [
    {
      name: "Smart Phones",
      slug: "smart-phones",
      description: "Flagship and everyday smartphones with official 1-year warranty.",
      sortOrder: 1,
      isActive: true
    },
    {
      name: "Tablets",
      slug: "tablets",
      description: "High-performance productivity tablets and creative displays.",
      sortOrder: 2,
      isActive: true
    },
    {
      name: "Audio & Wearables",
      slug: "audio-wearables",
      description: "Wireless earbuds, noise-canceling headphones, and smartwatches.",
      sortOrder: 3,
      isActive: true
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Fast chargers, cables, protective cases, and tempered glass.",
      sortOrder: 4,
      isActive: true
    }
  ];

  for (const cat of baseCategories) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive
      },
      create: cat
    });
    console.log(`   ✓ Category: ${upserted.name} (${upserted.slug})`);
  }

  // 3. Initialize First Admin (if none exists)
  console.log("3. Checking for administrator accounts...");
  const adminCount = await prisma.adminUser.count();
  if (adminCount === 0) {
    const adminEmail = (process.env.ADMIN_EMAIL || "jabour@jabourphone.com").toLowerCase().trim();
    const adminName = process.env.ADMIN_NAME || "Jabour";
    const rawPassword = process.env.ADMIN_PASSWORD || "JabourPhone2026!Secure";

    const passwordHash = await hashPassword(rawPassword);

    await prisma.adminUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN"
      }
    });

    console.log(`   ✓ Created initial Super Admin: ${adminEmail}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`   ⚠️ Generated default password: "${rawPassword}"`);
      console.log("   👉 IMPORTANT: Change this password immediately after logging in at /admin/login!");
    }
  } else {
    console.log(`   ✓ Found ${adminCount} existing admin account(s). Skipped admin creation.`);
  }

  console.log("==================================================");
  console.log("✅ Production safe seed finished successfully.");
  console.log("📦 Demo products were NOT created (kept strictly isolated in prisma/demo-seed.ts).");
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
