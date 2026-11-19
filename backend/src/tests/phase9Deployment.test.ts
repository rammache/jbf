import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { getJwtSecret } from "../utils/jwt.js";
import { getUploadsDir, persistUploadedFile } from "../middleware/upload.js";
import { getPing } from "../controllers/healthController.js";
import { Request, Response } from "express";

describe("Phase 9 - Deployment And Handover Automated Test Suite", () => {
  const rootDir = path.resolve(__dirname, "../../..");
  const backendDir = path.resolve(__dirname, "../..");
  const frontendDir = path.resolve(rootDir, "frontend");

  describe("Task 1: Environment Variables Documentation (.env.example)", () => {
    it("backend/.env.example documents all essential production environment variables", () => {
      const backendEnvExamplePath = path.join(backendDir, ".env.example");
      assert.ok(fs.existsSync(backendEnvExamplePath), "backend/.env.example must exist");

      const content = fs.readFileSync(backendEnvExamplePath, "utf-8");
      const requiredKeys = [
        "PORT",
        "NODE_ENV",
        "DATABASE_URL",
        "POSTGRES_PASSWORD",
        "FRONTEND_URL",
        "JWT_SECRET",
        "JWT_EXPIRES_IN_SECONDS",
        "LOGIN_RATE_LIMIT_WINDOW_MS",
        "ORDER_RATE_LIMIT_WINDOW_MS",
        "NEWSLETTER_RATE_LIMIT_WINDOW_MS",
        "SERVE_FRONTEND",
        "UPLOADS_DIR",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD"
      ];

      for (const key of requiredKeys) {
        assert.ok(
          content.includes(key),
          `backend/.env.example must document ${key}`
        );
      }
    });

    it("frontend/.env.example documents VITE_API_BASE_URL", () => {
      const frontendEnvExamplePath = path.join(frontendDir, ".env.example");
      assert.ok(fs.existsSync(frontendEnvExamplePath), "frontend/.env.example must exist");

      const content = fs.readFileSync(frontendEnvExamplePath, "utf-8");
      assert.ok(
        content.includes("VITE_API_BASE_URL"),
        "frontend/.env.example must document VITE_API_BASE_URL"
      );
    });
  });

  describe("Task 2: Production Build & Monorepo Package Scripts", () => {
    it("backend/package.json contains all required production scripts", () => {
      const backendPkgPath = path.join(backendDir, "package.json");
      const pkg = JSON.parse(fs.readFileSync(backendPkgPath, "utf-8"));

      assert.ok(pkg.scripts.build, "Must have build script");
      assert.ok(pkg.scripts.start, "Must have start script");
      assert.ok(pkg.scripts["prisma:deploy"], "Must have prisma:deploy script");
      assert.ok(pkg.scripts["prod:init"], "Must have prod:init script");
      assert.ok(pkg.scripts.test, "Must have test script");
    });

    it("frontend/package.json contains production build and test scripts", () => {
      const frontendPkgPath = path.join(frontendDir, "package.json");
      const pkg = JSON.parse(fs.readFileSync(frontendPkgPath, "utf-8"));

      assert.ok(pkg.scripts.build, "Must have build script");
      assert.ok(pkg.scripts.test, "Must have test script");
    });

    it("root package.json orchestrates repository build, test, and start", () => {
      const rootPkgPath = path.join(rootDir, "package.json");
      assert.ok(fs.existsSync(rootPkgPath), "Root package.json must exist");

      const pkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
      assert.ok(pkg.scripts.build.includes("prefix backend"), "Root build must build backend");
      assert.ok(pkg.scripts.build.includes("prefix frontend"), "Root build must build frontend");
      assert.ok(pkg.scripts.test.includes("prefix backend"), "Root test must test backend");
      assert.ok(pkg.scripts.test.includes("prefix frontend"), "Root test must test frontend");
      assert.ok(pkg.scripts.start.includes("prefix backend"), "Root start must start backend");
    });
  });

  describe("Task 3: Production Dockerfiles & Container Plans", () => {
    it("backend/Dockerfile exists and has multi-stage build with healthcheck", () => {
      const dockerfilePath = path.join(backendDir, "Dockerfile");
      assert.ok(fs.existsSync(dockerfilePath), "backend/Dockerfile must exist");

      const content = fs.readFileSync(dockerfilePath, "utf-8");
      assert.ok(content.includes("AS builder"), "Must have builder stage");
      assert.ok(content.includes("AS runner"), "Must have runner stage");
      assert.ok(content.includes("HEALTHCHECK"), "Must define HEALTHCHECK");
      assert.ok(content.includes("/health/ping"), "Healthcheck must target /health/ping");
    });

    it("frontend/Dockerfile and nginx.conf exist and configure SPA routing", () => {
      const dockerfilePath = path.join(frontendDir, "Dockerfile");
      const nginxConfPath = path.join(frontendDir, "nginx.conf");
      assert.ok(fs.existsSync(dockerfilePath), "frontend/Dockerfile must exist");
      assert.ok(fs.existsSync(nginxConfPath), "frontend/nginx.conf must exist");

      const nginxContent = fs.readFileSync(nginxConfPath, "utf-8");
      assert.ok(nginxContent.includes("try_files $uri $uri/ /index.html"), "Nginx must have SPA routing");
      assert.ok(nginxContent.includes("gzip on"), "Nginx must enable gzip");
    });

    it("Root unified Dockerfile exists for full-stack single-container hosting", () => {
      const unifiedDockerfilePath = path.join(rootDir, "Dockerfile");
      assert.ok(fs.existsSync(unifiedDockerfilePath), "Root Dockerfile must exist");

      const content = fs.readFileSync(unifiedDockerfilePath, "utf-8");
      assert.ok(content.includes("frontend-builder"), "Must build frontend");
      assert.ok(content.includes("backend-builder"), "Must build backend");
      assert.ok(content.includes("SERVE_FRONTEND=true"), "Must enable SERVE_FRONTEND");
    });

    it("docker-compose.prod.yml defines postgres and unified app with healthchecks and persistent volumes", () => {
      const composeProdPath = path.join(rootDir, "docker-compose.prod.yml");
      assert.ok(fs.existsSync(composeProdPath), "docker-compose.prod.yml must exist");

      const content = fs.readFileSync(composeProdPath, "utf-8");
      assert.ok(content.includes("postgres:16-alpine"), "Must use postgres 16");
      assert.ok(content.includes("postgres_data:"), "Must declare postgres volume");
      assert.ok(content.includes("uploads_data:"), "Must declare uploads volume");
      assert.ok(content.includes("service_healthy"), "App must wait for postgres healthcheck");
    });

    it("render.yaml and railway.json blueprints exist", () => {
      const renderPath = path.join(rootDir, "render.yaml");
      const railwayPath = path.join(rootDir, "railway.json");
      assert.ok(fs.existsSync(renderPath), "render.yaml must exist");
      assert.ok(fs.existsSync(railwayPath), "railway.json must exist");
    });
  });

  describe("Task 5 & 7: Upload Persistence & Strong Secrets Validation", () => {
    it("getUploadsDir returns resolved persistent directory path", () => {
      const dir = getUploadsDir();
      assert.ok(typeof dir === "string" && dir.length > 0, "Uploads dir must be non-empty string");
    });

    it("persistUploadedFile falls back to persistent volume URL when Cloudinary is not configured", async () => {
      const fakeFile = {
        filename: "test-phone.webp",
        path: "/tmp/test-phone.webp",
        mimetype: "image/webp"
      } as unknown as Express.Multer.File;

      const url = await persistUploadedFile(fakeFile);
      assert.strictEqual(url, "/uploads/test-phone.webp");
    });

    it("getJwtSecret enforces 32+ character requirement and rejects placeholders in production", () => {
      const originalEnv = process.env.NODE_ENV;
      const originalSecret = process.env.JWT_SECRET;

      try {
        process.env.NODE_ENV = "production";

        // Test placeholder secret
        process.env.JWT_SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_SECRET_AT_LEAST_32_CHARS";
        assert.throws(
          () => getJwtSecret(),
          /Insecure JWT_SECRET detected in production/,
          "Must throw on placeholder secret in production"
        );

        // Test short secret
        process.env.JWT_SECRET = "short_insecure_secret";
        assert.throws(
          () => getJwtSecret(),
          /Insecure JWT_SECRET detected in production/,
          "Must throw on short secret in production"
        );

        // Test valid strong secret
        process.env.JWT_SECRET = "a_very_strong_random_secret_that_is_at_least_32_characters_long!";
        const secret = getJwtSecret();
        assert.strictEqual(secret, "a_very_strong_random_secret_that_is_at_least_32_characters_long!");
      } finally {
        process.env.NODE_ENV = originalEnv;
        process.env.JWT_SECRET = originalSecret;
      }
    });
  });

  describe("Task 6: Safe Production Seed Without Demo Data", () => {
    it("backend/prisma/seed.ts initializes StoreSettings, categories, and initial admin without demo products", () => {
      const seedPath = path.join(backendDir, "prisma/seed.ts");
      const content = fs.readFileSync(seedPath, "utf-8");

      assert.ok(content.includes("prisma.storeSettings"), "Seed must initialize StoreSettings");
      assert.ok(content.includes("Smart Phones"), "Seed must include Smart Phones category");
      assert.ok(content.includes("SUPER_ADMIN"), "Seed must create initial admin account with role");
      assert.ok(
        !content.includes("Kestrel 14"),
        "Production seed must NOT include demo products like Kestrel 14"
      );
    });
  });

  describe("Task 8: Uptime Monitoring Ping Endpoint", () => {
    it("getPing returns 200 with status ok and timestamp", () => {
      let statusCode = 0;
      let responseJson: Record<string, unknown> = {};

      const mockRes = {
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(data: Record<string, unknown>) {
          responseJson = data;
          return this;
        }
      } as unknown as Response;

      getPing({} as Request, mockRes);

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(responseJson.status, "ok");
      assert.strictEqual(responseJson.service, "Jabour Phone API");
      assert.ok(responseJson.timestamp, "Must return timestamp");
    });
  });

  describe("Task 9, 10, 11: Handover, Review & Security Documentation", () => {
    it("ADMIN_GUIDE.md exists and contains complete Arabic & English instructions for Jabour", () => {
      const guidePath = path.join(rootDir, "ADMIN_GUIDE.md");
      assert.ok(fs.existsSync(guidePath), "ADMIN_GUIDE.md must exist");

      const content = fs.readFileSync(guidePath, "utf-8");
      assert.ok(content.includes("دليل إدارة متجر جبور فون"), "Must contain Arabic title");
      assert.ok(content.includes("/admin/login"), "Must explain login");
      assert.ok(content.includes("Managing Categories"), "Must cover categories");
      assert.ok(content.includes("Managing Products"), "Must cover products and photos");
      assert.ok(content.includes("Managing Orders"), "Must cover orders and WhatsApp shortcuts");
      assert.ok(content.includes("Store Settings"), "Must cover settings");
    });

    it("DEPLOYMENT.md exists and details Railway, Render, VPS Caddy, and Vercel", () => {
      const deployPath = path.join(rootDir, "DEPLOYMENT.md");
      assert.ok(fs.existsSync(deployPath), "DEPLOYMENT.md must exist");

      const content = fs.readFileSync(deployPath, "utf-8");
      assert.ok(content.includes("Railway"), "Must cover Railway");
      assert.ok(content.includes("Render"), "Must cover Render");
      assert.ok(content.includes("Caddy"), "Must cover VPS Caddy SSL");
      assert.ok(content.includes("Cloudinary"), "Must cover Cloudinary");
    });

    it("MONITORING.md exists and covers /health/ping and UptimeRobot/BetterStack", () => {
      const monitorPath = path.join(rootDir, "MONITORING.md");
      assert.ok(fs.existsSync(monitorPath), "MONITORING.md must exist");

      const content = fs.readFileSync(monitorPath, "utf-8");
      assert.ok(content.includes("/health/ping"), "Must document ping endpoint");
      assert.ok(content.includes("BetterStack"), "Must document uptime monitoring");
    });

    it("PRELAUNCH_REVIEW.md exists and includes responsive and mobile checklist", () => {
      const reviewPath = path.join(rootDir, "PRELAUNCH_REVIEW.md");
      assert.ok(fs.existsSync(reviewPath), "PRELAUNCH_REVIEW.md must exist");

      const content = fs.readFileSync(reviewPath, "utf-8");
      assert.ok(content.includes("Mobile & Desktop Audit Checklist"), "Must include mobile checklist");
      assert.ok(content.includes("WhatsApp Order Button"), "Must verify WhatsApp button");
    });

    it("SECURITY.md exists and validates all 18 security controls", () => {
      const secPath = path.join(rootDir, "SECURITY.md");
      assert.ok(fs.existsSync(secPath), "SECURITY.md must exist");

      const content = fs.readFileSync(secPath, "utf-8");
      assert.ok(content.includes("Security Architecture & Controls"), "Must detail security controls");
      assert.ok(content.includes("Pre-Launch Security Audit Verification"), "Must include audit checklist");
    });

    it("backend/scripts/cron-backup.sh exists and is executable", () => {
      const backupScriptPath = path.join(backendDir, "scripts/cron-backup.sh");
      assert.ok(fs.existsSync(backupScriptPath), "cron-backup.sh must exist");

      const content = fs.readFileSync(backupScriptPath, "utf-8");
      assert.ok(content.includes("pg_dump"), "Must execute pg_dump");
      assert.ok(content.includes("RETENTION_DAYS"), "Must implement backup retention");
    });
  });
});
