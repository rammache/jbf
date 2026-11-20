import "dotenv/config";
import { prisma } from "../prisma.js";
import { hashPassword } from "../utils/password.js";

async function main() {
  const email = (process.env.ADMIN_EMAIL || process.argv[2] || "jabour@jabourphone.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || process.argv[3] || "JabourPhone2026!Secure";
  const name = process.env.ADMIN_NAME || "Jabour";

  console.log(`Setting up admin user: ${email}...`);

  const passwordHash = await hashPassword(password);

  const existing = await prisma.adminUser.findFirst({
    where: { email: { equals: email, mode: "insensitive" } }
  });

  if (existing) {
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: {
        name,
        passwordHash,
        role: "SUPER_ADMIN"
      }
    });
    console.log(`✓ Successfully updated password for existing admin: ${email}`);
  } else {
    await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash,
        role: "SUPER_ADMIN"
      }
    });
    console.log(`✓ Successfully created new SUPER_ADMIN: ${email}`);
  }

  console.log(`-----------------------------------------------`);
  console.log(`Admin Email:    ${email}`);
  console.log(`Admin Password: ${password}`);
  console.log(`Role:           SUPER_ADMIN`);
  console.log(`-----------------------------------------------`);
  console.log(`You can now sign in at /admin with these credentials.`);
}

main()
  .catch((err) => {
    console.error("❌ Failed to set admin credentials:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
