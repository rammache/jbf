import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Running the safe seed (non-destructive, no deletes).");
  console.log("No production-safe base data is defined yet, so there is nothing to seed.");
  console.log("For the local demo catalog, run: npm run prisma:seed:demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
