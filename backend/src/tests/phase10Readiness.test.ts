import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";

describe("Phase 10 - Launch Readiness & Verification Automated Test Suite", () => {
  const rootDir = path.resolve(__dirname, "../../..");
  const backendDir = path.resolve(__dirname, "../..");
  const frontendDir = path.resolve(rootDir, "frontend");

  describe("Task 1: Production Bundle Optimization & Code-Splitting", () => {
    it("frontend/vite.config.ts configures manualChunks for vendor and icons", () => {
      const viteConfigPath = path.join(frontendDir, "vite.config.ts");
      assert.ok(fs.existsSync(viteConfigPath), "frontend/vite.config.ts must exist");

      const content = fs.readFileSync(viteConfigPath, "utf-8");
      assert.ok(content.includes("manualChunks"), "vite.config.ts must define manualChunks");
      assert.ok(content.includes("vendor"), "manualChunks must include vendor split");
      assert.ok(content.includes("icons"), "manualChunks must include icons split");
    });

    it("root package.json defines unified monorepo commands", () => {
      const rootPkgPath = path.join(rootDir, "package.json");
      assert.ok(fs.existsSync(rootPkgPath), "package.json must exist at root");

      const pkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
      assert.ok(pkg.scripts.build, "build script must exist");
      assert.ok(pkg.scripts.start, "start script must exist");
      assert.ok(pkg.scripts.test, "test script must exist");
      assert.ok(pkg.scripts.lint, "lint script must exist");
    });
  });

  describe("Task 2: Production Documentation Completeness", () => {
    const requiredDocs = [
      "README.md",
      "ADMIN_GUIDE.md",
      "DEPLOYMENT.md",
      "MONITORING.md",
      "PRELAUNCH_REVIEW.md",
      "SECURITY.md",
      "BACKUP.md",
      "LEGAL.md"
    ];

    for (const doc of requiredDocs) {
      it(`verifies presence and non-emptiness of ${doc}`, () => {
        const docPath = path.join(rootDir, doc);
        assert.ok(fs.existsSync(docPath), `${doc} must exist`);
        const stats = fs.statSync(docPath);
        assert.ok(stats.size > 200, `${doc} must have substantial content (>200 bytes)`);
      });
    }
  });

  describe("Task 3: Security & Secrets Guard", () => {
    it(".gitignore excludes environment files, build artifacts, and uploads", () => {
      const gitignorePath = path.join(rootDir, ".gitignore");
      assert.ok(fs.existsSync(gitignorePath), ".gitignore must exist at root");

      const content = fs.readFileSync(gitignorePath, "utf-8");
      assert.ok(content.includes(".env"), ".gitignore must ignore .env files");
      assert.ok(content.includes("node_modules"), ".gitignore must ignore node_modules");
      assert.ok(content.includes("dist"), ".gitignore must ignore dist");
      assert.ok(content.includes("uploads"), ".gitignore must ignore uploads");
    });
  });

  describe("Task 4: Work Ledger & Phase Synchronization", () => {
    it("WORK/tasks.md and WORK/progression.md verify all phases 0 through 10 are completed", () => {
      const tasksPath = path.join(rootDir, "WORK", "tasks.md");
      const progPath = path.join(rootDir, "WORK", "progression.md");

      assert.ok(fs.existsSync(tasksPath), "WORK/tasks.md must exist");
      assert.ok(fs.existsSync(progPath), "WORK/progression.md must exist");

      const tasksContent = fs.readFileSync(tasksPath, "utf-8");
      const progContent = fs.readFileSync(progPath, "utf-8");

      assert.ok(!tasksContent.includes("- [ ]"), "No unchecked tasks should remain in tasks.md");
      assert.ok(progContent.includes("Phase 9"), "progression.md must document Phase 9");
      assert.ok(progContent.includes("Phase 10"), "progression.md must document Phase 10");
    });
  });
});
