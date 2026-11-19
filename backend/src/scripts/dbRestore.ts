import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const backupsDir = path.resolve(__dirname, "../../backups");

function runRestore() {
  const targetFileArg = process.argv[2];

  let targetFile = targetFileArg;
  if (!targetFile) {
    if (!fs.existsSync(backupsDir)) {
      console.error("❌ No backups directory found at:", backupsDir);
      process.exit(1);
    }

    const files = fs
      .readdirSync(backupsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error("❌ No .sql backup files found in:", backupsDir);
      process.exit(1);
    }

    targetFile = path.join(backupsDir, files[0]);
    console.log(`ℹ️  No backup file specified. Using most recent backup: ${files[0]}`);
  }

  if (!fs.existsSync(targetFile)) {
    console.error(`❌ Backup file not found: ${targetFile}`);
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ Error: DATABASE_URL is not set in environment or .env file.");
    process.exit(1);
  }

  console.log(`⚠️  WARNING: Restoring will overwrite existing data in the database.`);
  console.log(`📦 Restoring from: ${targetFile}`);

  try {
    execSync(`psql "${dbUrl}" < "${targetFile}"`, {
      stdio: "inherit"
    });
    console.log("✅ Database successfully restored!");
  } catch {
    console.log("ℹ️  Direct psql failed. Attempting via docker compose exec...");
    try {
      execSync(`docker compose exec -T db psql -U postgres electro_db < "${targetFile}"`, {
        stdio: "inherit"
      });
      console.log("✅ Database successfully restored via Docker!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Restore failed:", message);
      console.log("\n💡 Please refer to BACKUP.md for detailed restoration procedures.");
      process.exit(1);
    }
  }
}

runRestore();
