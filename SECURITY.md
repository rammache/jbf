# Jabour Phone - Security Architecture & Pre-Launch Audit

This document outlines the security controls implemented across the Jabour Phone platform and serves as the official pre-launch security checklist.

---

## 🛡️ Security Architecture & Controls

### 1. Secrets Management & Repository Hygiene
- **Zero Committed Secrets:** All credentials, database connection strings, and cryptographic secrets are stored exclusively in git-ignored `.env` files.
- **Gitignore Enforcement:** Root `.gitignore` explicitly prevents `.env`, `.env.*` (with `!.env.example` exception), `node_modules/`, `dist/`, logs, and `uploads/` from being committed.
- **Production Secret Validation:** In production mode (`NODE_ENV=production`), `backend/src/utils/jwt.ts` verifies that `JWT_SECRET` is at least 32 characters long and rejects default placeholder strings on server startup (fail-fast).

### 2. Admin Authentication & Session Management
- **Password Hashing:** Passwords are never stored in plaintext. They are hashed using `bcryptjs` with salt factor 12 (computationally expensive to prevent brute-force and rainbow table attacks).
- **Secure httpOnly Cookies:** Admin session tokens are stored in `jabour_admin_token` cookies:
  - `HttpOnly`: Inaccessible to client-side JavaScript, preventing Cross-Site Scripting (XSS) session theft.
  - `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF).
  - `Secure`: Transmitted strictly over HTTPS in production.
  - `Path=/`: Scoped appropriately.
- **Sensible Expiry:** Tokens expire after 8 hours (`JWT_EXPIRES_IN_SECONDS=28800`).
- **Fail-Closed Protection:** `requireAdmin` middleware re-queries the database on every authenticated request, immediately revoking access if an admin account is deleted or modified.

### 3. Rate Limiting & Brute-Force Prevention
- **Admin Login Rate Limiting:** Capped at 5 failed login attempts per 15 minutes per IP (`loginRateLimiter`). Successful logins bypass penalty.
- **Order Submission Rate Limiting:** Capped at 10 checkout submissions per 15 minutes per IP (`orderRateLimiter`) to prevent spam and inventory denial-of-service.
- **Newsletter Rate Limiting:** Capped at 5 subscriber signups per 15 minutes per IP (`newsletterRateLimiter`).

### 4. Input Validation & Injection Prevention
- **SQL Injection Defense:** All database queries are executed using Prisma ORM with parameterized queries and prepared statements.
- **Zod Schema Validation:** Every incoming API request body, URL parameter, and query parameter is strictly validated using Zod schemas:
  - Rejecting unexpected fields and type mismatches (`validateBody`, `validateQuery`, `validateParams`).
  - Strict regex formatting for phone numbers, emails, slugs, and SKUs.
- **Zero `any` Types:** All backend controllers and utilities are strongly typed.

### 5. Financial & Inventory Tampering Defense
- **Server-Side Price Authority:** Client-side cart item prices are completely ignored during checkout. `createOrder` queries authoritative prices directly from the database and recalculates subtotal, taxes, shipping fees, and discounts server-side.
- **PostgreSQL Decimal Precision:** All monetary amounts are stored as `Decimal(10, 2)` to eliminate JavaScript floating-point rounding errors.
- **Atomic Stock Transactions:** Inventory availability verification, atomic stock decrements (`stock: { decrement: qty }`), and order record creation execute in an atomic database `$transaction`.
- **Stock Restoration Safeguard:** Order cancellation atomically increments stock back into inventory. Reactivating a cancelled order validates stock before restoring.

### 6. HTTP Headers, CORS & Payload Controls
- **Security Headers (Helmet equivalent):**
  - `X-Frame-Options: DENY` (prevents clickjacking)
  - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (enforces HTTPS)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Powered-By`: Removed to prevent server fingerprinting.
- **CORS Allow-List:** In production, cross-origin requests are strictly restricted to verified origins (`FRONTEND_URL` and `CORS_ORIGIN`).
- **Request Size Limits:** JSON and url-encoded body parsing capped at 1MB to prevent memory exhaustion attacks.
- **File Upload Security:** Multi-file image uploads are restricted to genuine image MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) with a 10MB per-image limit and randomized safe filenames.

---

## 📋 Pre-Launch Security Audit Verification

| Security Control | Implementation Location | Verified Status |
| :--- | :--- | :--- |
| No tracked secrets in git | `.gitignore` & git commit history | ✅ Passed |
| Bcrypt password hashing (Cost 12) | `backend/src/utils/password.ts` | ✅ Passed |
| JWT httpOnly cookie auth | `backend/src/middleware/requireAdmin.ts` | ✅ Passed |
| Protected Admin API routes | `backend/src/routes/admin.ts` | ✅ Passed |
| Production JWT length >= 32 chars | `backend/src/utils/jwt.ts` | ✅ Passed |
| Login brute-force rate limiter | `backend/src/middleware/rateLimit.ts` | ✅ Passed |
| Order spam rate limiter | `backend/src/middleware/rateLimit.ts` | ✅ Passed |
| Server-side price recalculation | `backend/src/controllers/orderController.ts` | ✅ Passed |
| Atomic stock transaction | `backend/src/controllers/orderController.ts` | ✅ Passed |
| Stock restoration on cancel | `backend/src/controllers/adminOrderController.ts`| ✅ Passed |
| Decimal money fields | `backend/prisma/schema.prisma` | ✅ Passed |
| Strict Zod schemas | `backend/src/schemas/*.ts` | ✅ Passed |
| HTTP Security Headers | `backend/src/middleware/security.ts` | ✅ Passed |
| Production CORS origin restrictions | `backend/src/middleware/security.ts` | ✅ Passed |
| 1MB request body limit | `backend/src/server.ts` | ✅ Passed |
| Multer MIME validation | `backend/src/middleware/upload.ts` | ✅ Passed |
| Safe production seed (no demo data) | `backend/prisma/seed.ts` | ✅ Passed |
| Automated database backups | `backend/scripts/cron-backup.sh` | ✅ Passed |
