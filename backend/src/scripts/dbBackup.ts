import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const backupsDir = path.resolve(__dirname, "../../backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupsDir, `jabour_phone_backup_${timestamp}.sql`);

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ Error: DATABASE_URL is not set in environment or .env file.");
    process.exit(1);
  }

  console.log(`📦 Starting PostgreSQL backup for Jabour Phone...`);
  console.log(`🎯 Destination: ${backupFile}`);

  try {
    // Attempt pg_dump with connection string
    execSync(`pg_dump "${dbUrl}" --clean --if-exists --no-owner --no-privileges > "${backupFile}"`, {
      stdio: "inherit"
    });
    console.log(`✅ Backup successfully created at: ${backupFile}`);
  } catch {
    console.log("ℹ️  Direct pg_dump failed. Attempting via docker compose exec...");
    try {
      execSync(`docker compose exec -T db pg_dump -U postgres electro_db --clean --if-exists > "${backupFile}"`, {
        stdio: "inherit"
      });
      console.log(`✅ Backup successfully created via Docker at: ${backupFile}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Backup failed:", message);
      console.log("\n💡 If running locally without PostgreSQL CLI tools installed, please see BACKUP.md for manual Docker instructions.");
      process.exit(1);
    }
  }
}

runBackup();
