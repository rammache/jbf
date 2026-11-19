# Jabour Phone - Tasks

Store: **Jabour Phone**
Goal: Jabour can log in and manage categories, products, photos, stock, orders, and site content without a developer.

Based on the current Electro-based project review.
Legend: **P0** = must have before launch, **P1** = should have, **P2** = later / optional.

---

## Project Snapshot (for any new AI agent)

- **Project:** Jabour Phone e-commerce store.
- **Owner:** Jabour. The user is helping him.
- **Goal:** Jabour can log in and manage categories, products, photos, stock, orders, and site content without a developer.
- **Stack:** React + Vite + TypeScript + Tailwind, Express + TypeScript + Prisma + PostgreSQL.
- **Current state:** public demo storefront only. No admin/login/CRUD/order management yet.
- **Full history:** read `WORK/progression.md` before starting.

## Session Workflow (IMPORTANT - READ FIRST)

This project is worked on across many sessions. A session may use the same AI agent or a different one.
The WORK files must carry enough context for any agent to continue without guessing.

- Do **ONE task per session**, then stop. Do not start the next task in the same session.
- At the start of a session: read `WORK/progression.md` and this file, then repeat the current task back to the user.
- Before coding: confirm the exact task with the user and do not implement anything else.
- When a task is finished:
  1. Mark it `[x]` in this file.
  2. Move it to `WORK/progression.md` with the date and files changed.
  3. Run the relevant checks (build/typecheck/tests) and record the result.
  4. Add a session note at the bottom of `progression.md`: what was done, what was tested, what is next.
- Then tell the user exactly:
  **"Task finished. Please start a new session for the next task so we keep one task per session. You can use the same AI agent or a different one."**
- Never continue to another task after finishing one, even if the next task looks small.

---

## What To Keep

- Express + TypeScript + Prisma + PostgreSQL backend.
- React + Vite + TypeScript + Tailwind frontend.
- Public storefront: Home, Shop, Product Detail, About.
- Cart drawer, search modal, checkout flow, newsletter form.
- Existing Prisma models as a starting point.
- Docker Compose PostgreSQL setup.

---

## What To Add (Summary)

1. Admin authentication (login, JWT/session, password hashing).
2. Admin dashboard with protected routes.
3. Category CRUD (create, edit, delete, activate, reorder, image).
4. Product CRUD (create, edit, delete/archive, publish, featured, images, specs).
5. Image upload (Cloudinary or local uploads with persistence).
6. Stock/inventory tracking.
7. Order management dashboard (list, filter, view, update status, cancel).
8. Server-side price recalculation and stock validation.
9. Shipping fee, delivery details, and payment method (Cash on Delivery first).
10. Dynamic categories and brands from the API instead of hardcoded lists.
11. Rebranding from Electro to Jabour Phone.
12. Contact page, WhatsApp order option, FAQ, shipping/returns/privacy/terms.
13. Input validation, security middleware, migrations, .gitignore, tests.
14. Production deployment and a simple handover guide for Jabour.

---

## What To Remove (Summary)

1. `rea_exported_scripts/` - unused captured Colorlib/Cloudflare/analytics scripts; incomplete REA capture; license/provenance risk.
2. `products_data.json` - legacy duplicate of the seed data; unused by the app.
3. All "Electro" branding: Navbar logo, Footer, page titles, README, health endpoint, newsletter success text, localStorage key, package names, tailwind palette key.
4. Fake brands and fake content: Kestrel, Nord, Meridian, Torus, "bench tested in Manchester", fake review counts, fake UK address.
5. Hardcoded category lists duplicated in Navbar, Footer, Home, and Shop.
6. Hardcoded Hero product (Kestrel 14) and hardcoded promo price.
7. External Unsplash image URLs once real product photos exist.
8. Unused imports and dead code (for example `ArrowLeft` in ProductDetail).
9. Destructive seed behavior (`deleteMany` of orders/order items on every seed).
10. The fake account icon that links to `/about` (replace with real login or remove).
11. Committed `.env` secrets (replace with `.env.example`).

---

## Phase 0 - Stabilize And Clean

- [x] Fix frontend build error: remove unused `ArrowLeft` import in `frontend/src/pages/ProductDetail.tsx:3`. **P0**
- [x] Fix backend type error: type the `p` parameter in `productController.ts:101`. **P0**
- [x] Make `npm run build` (frontend) and `npx tsc --noEmit` (backend) pass. **P0**
- [x] Add root `.gitignore`: `node_modules`, `dist`, `.env`, `uploads`, logs, `.DS_Store`. **P0**
- [ ] Initialize git and make a clean first commit. **P0**
- [ ] Add `backend/.env.example` and `frontend/.env.example`; remove real secrets from tracked files. **P0**
- [ ] Rotate the PostgreSQL password and update `DATABASE_URL`. **P0**
- [ ] Delete `rea_exported_scripts/` from the project (archive it outside the repo if needed). **P0**
- [ ] Delete `products_data.json`. **P0**
- [ ] Remove destructive `deleteMany` from seed; move demo data to a guarded demo seed. **P0**
- [ ] Decide whether `Category.image` is used; use it or remove it. **P1**
- [ ] Add a 404 route/page instead of a blank screen. **P1**

---

## Phase 1 - Rebrand To Jabour Phone

- [ ] Replace "Electro" in Navbar, Footer, About, index.html title/favicon, announcements. **P0**
- [ ] Replace "Electro" in README, health endpoint name, newsletter success message. **P0**
- [ ] Rename `electro-cart` localStorage key and `electro` Tailwind palette key. **P1**
- [ ] Rename package names from `electro-backend` / `electro-frontend` to `jabour-phone-*`. **P2**
- [ ] Replace fake brands (Kestrel, Nord, Meridian, Torus) with Jabour Phone real brands. **P0**
- [ ] Replace demo phone/laptop catalog with Jabour Phone's real categories and products. **P0**
- [ ] Replace "bench tested / Manchester / two year warranty / 30 day returns" with Jabour's real promises. **P0**
- [ ] Add real business info: phone, WhatsApp, email, city/address, opening hours. **P0**
- [ ] Choose currency and update every price display (currently USD `$`). **P0**
- [ ] Set real delivery fee and free-delivery threshold (or remove "free over $50"). **P0**
- [ ] Replace hardcoded hero with an admin-selected featured product or a real Jabour promo. **P1**
- [ ] Replace external template images with Jabour-owned photos and logo. **P0**
- [ ] Verify the Colorlib Electro license/attribution before commercial launch. **P0**
- [ ] Adjust colors/typography to the Jabour Phone brand. **P1**

---

## Phase 2 - Admin Foundation

- [ ] Add `AdminUser` model: id, name, email (unique), passwordHash, role, createdAt, updatedAt. **P0**
- [ ] Hash passwords with bcrypt/argon2. **P0**
- [ ] Implement auth: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`. **P0**
- [ ] Use secure httpOnly cookies or short-lived JWT; add refresh or sensible expiry. **P0**
- [ ] Add `requireAdmin` middleware and protect every write route. **P0**
- [ ] Add first-admin creation command/seed (Jabour's email + strong password). **P0**
- [ ] Build `/admin/login` page and an admin layout with sidebar/header/logout. **P0**
- [ ] Add protected admin routes and redirect unauthenticated users. **P0**
- [ ] Add 401/403 handling in the frontend API layer. **P0**
- [ ] Add "change password" for the admin. **P1**
- [ ] Add zod validation for auth payloads. **P1**
- [ ] Add rate limiting on login. **P1**

---

## Phase 3 - Category Management

- [ ] Replace `Product.category` string with a `categoryId` relation to `Category`. **P0**
- [ ] Extend `Category`: name, slug, description, image, sortOrder, isActive. **P0**
- [ ] Auto-generate unique slugs and keep old slugs stable on rename. **P1**
- [ ] Admin API: `GET/POST/PUT/DELETE /api/admin/categories` plus reorder. **P0**
- [ ] Admin UI: category table, create/edit form, image upload, active toggle, delete. **P0**
- [ ] Block deletion when products still belong to the category (or ask to reassign). **P0**
- [ ] Public `GET /api/categories` returns only active categories, sorted. **P0**
- [ ] Use API categories in Navbar, Footer, Home tabs, and Shop filters. **P0**
- [ ] Remove all hardcoded category arrays from components. **P0**
- [ ] Add category image usage on the home page (or remove the field). **P2**

---

## Phase 4 - Product Management

- [ ] Extend `Product`: description, sku, stock, lowStockThreshold, isActive, categoryId, brand, isFeatured. **P0**
- [ ] Decide phone variants model: color, storage, RAM, condition (new/used/refurbished). **P0**
- [ ] Add phone-specific spec fields (screen, battery, camera, network, warranty). **P1**
- [ ] Auto-generate unique slug/handle from title; do not break existing links on edit. **P0**
- [ ] Admin API: full CRUD under `/api/admin/products` with pagination and search. **P0**
- [ ] Admin UI: product table with search, category filter, active/featured status, stock, actions. **P0**
- [ ] Admin UI: create/edit product form with validation and live preview. **P0**
- [ ] Image upload endpoint (Cloudinary recommended, or local `/uploads` with persistent volume). **P0**
- [ ] Admin UI: multi-image upload, reorder, set primary image, delete image. **P0**
- [ ] Validate sale price: `compare` must be greater than `price` when set. **P1**
- [ ] Duplicate product action. **P2**
- [ ] Archive/delete rules: soft-delete products that appear in past orders. **P1**
- [ ] Stock: quantity, low-stock warnings, block checkout at zero. **P0**
- [ ] Public shop shows only active products, with pagination. **P0**
- [ ] Public product detail uses real description and specs. **P1**
- [ ] Admin bulk actions (activate/deactivate/delete). **P2**

---

## Phase 5 - Storefront Alignment

- [ ] Remove hardcoded Hero product and use featured/admin content. **P0**
- [ ] Fetch categories and brands from the API everywhere. **P0**
- [ ] Fix "Featured Bench" sort so it actually sorts featured products first. **P1**
- [ ] Wire `GET /api/categories` (currently unused) or remove the endpoint. **P0**
- [ ] Replace fake rating/review counts with real reviews or hide them until implemented. **P0**
- [ ] Add real reviews model and moderation (optional). **P2**
- [ ] Add contact page with phone, WhatsApp, email, map, hours. **P0**
- [ ] Add WhatsApp "Order" button on product pages. **P1**
- [ ] Add FAQ, Shipping, Returns, Privacy, Terms pages. **P0**
- [ ] Add order tracking page (order number + phone/email). **P1**
- [ ] Add 404 page and error boundary. **P1**
- [ ] Lock page scroll when cart/search/checkout modals are open. **P1**
- [ ] Add Esc-to-close and focus handling in modals (Search says "Esc" but does not close on Esc). **P1**
- [ ] Add accessible labels and keyboard navigation. **P1**
- [ ] Add SEO meta tags, Open Graph, sitemap.xml, robots.txt. **P1**
- [ ] Add responsive image optimization and lazy loading checks. **P2**

---

## Phase 6 - Orders And Checkout

- [ ] Add `OrderStatus` enum: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED. **P0**
- [ ] Fix status conflict: schema defaults to `PAID`, controller sets `COMPLETED`, UI says "Bench Testing". **P0**
- [ ] Add order fields: phone, city, address, notes, paymentMethod, subtotal, shippingFee, tax, orderNumber. **P0**
- [ ] Make phone number required (essential for delivery). **P0**
- [ ] Recalculate item prices and totals on the server from the database; never trust client prices. **P0**
- [ ] Validate stock and decrement inside a Prisma transaction. **P0**
- [ ] Restore stock when an order is cancelled. **P1**
- [ ] Admin orders API: list with pagination, filters, search, detail, update status, cancel. **P0**
- [ ] Admin orders UI with status badges, detail modal/page, and action buttons. **P0**
- [ ] Add order confirmation email to customer and notification to Jabour. **P1**
- [ ] Add Cash on Delivery as the first payment method. **P0**
- [ ] If online card payment is required, integrate a gateway and mark PAID only on verified webhook. **P2**
- [ ] Implement shipping fee rules and free-shipping threshold. **P1**
- [ ] Rate limit `POST /api/orders` and `POST /api/newsletter`. **P1**
- [ ] Do not expose orders by raw UUID only; require orderNumber + email/phone. **P1**

---

## Phase 7 - Newsletter, Settings, And Admin Extras

- [ ] Add `StoreSettings` model: store name, logo, phone, WhatsApp, email, address, currency, shipping fee, free-shipping threshold, social links. **P1**
- [ ] Admin settings page to edit these values. **P1**
- [ ] Frontend reads settings instead of hardcoded business text. **P1**
- [ ] Admin newsletter list with search, delete, and CSV export. **P1**
- [ ] Admin dashboard: orders today, revenue, pending orders, low stock, top products. **P1**
- [ ] Recent orders and recent products on the dashboard. **P2**
- [ ] Second admin account or role support. **P2**
- [ ] Coupon/discount codes. **P2**
- [ ] Supplier/purchase price and profit report. **P2**

---

## Phase 8 - Data Model And Backend Quality

- [ ] Change money fields from `Float` to `Decimal` (price, compare, totals, fees). **P0**
- [ ] Add Prisma migrations (`prisma migrate`) and commit the `migrations` folder. **P0**
- [ ] Add indexes: product slug, sku, categoryId, isActive, order status, order createdAt. **P1**
- [ ] Add unique constraints where needed (sku, orderNumber). **P1**
- [ ] Add central error handler and 404 middleware with consistent JSON errors. **P0**
- [ ] Add zod schemas for all request bodies/query params; remove `any` types. **P0**
- [ ] Add Helmet, CORS allow-list, body size limits, and request logging. **P1**
- [ ] Add pagination envelope: `{ data, page, pageSize, total, totalPages }`. **P1**
- [ ] Add database health check and graceful shutdown. **P2**
- [ ] Add backend tests: auth, products, categories, orders, stock transaction. **P1**
- [ ] Add frontend tests: cart, checkout, admin forms (Vitest + Testing Library). **P1**
- [ ] Add ESLint + Prettier to both apps. **P1**
- [ ] Add CI (GitHub Actions): typecheck, lint, tests, build. **P2**
- [ ] Add PostgreSQL backup/restore procedure. **P1**

---

## Phase 9 - Deployment And Handover

- [ ] Document all environment variables in `.env.example`. **P0**
- [ ] Add production build/start for backend and frontend. **P0**
- [ ] Add Dockerfiles or a hosted deployment plan (Railway/Render/VPS/Vercel). **P1**
- [ ] Serve frontend and API on the same domain or configure production proxy/CORS correctly. **P0**
- [ ] Persist uploads (Cloudinary or mounted volume); never rely on ephemeral disk. **P0**
- [ ] Run production migrations and create only the initial admin/categories; keep demo products out of production. **P0**
- [ ] Enable HTTPS, strong secrets, and automated backups. **P0**
- [ ] Add uptime/error monitoring. **P2**
- [ ] Write a simple admin guide for Jabour: add category, add product with photos, update stock, manage orders, export subscribers. **P0**
- [ ] Review the site with Jabour on mobile and desktop before launch. **P1**
- [ ] Final security checklist: no secrets in git, protected admin routes, rate limits, validated inputs, restricted CORS. **P0**

---

## Minimum Launch Checklist (Recommended Order)

1. Phase 0: fix build errors, `.gitignore`, remove REA/legacy files.
2. Phase 1: rebrand and replace fake content with Jabour's real catalog and info.
3. Phase 2: admin login and protected admin shell.
4. Phase 3 + 4: category and product CRUD with image upload and stock.
5. Phase 6: server-side pricing, stock transaction, order management, COD.
6. Phase 5: dynamic categories, contact/WhatsApp, policy pages.
7. Phase 8: validation, security, migrations, tests.
8. Phase 9: deploy, backups, and handover to Jabour.

Phases 7 and the optional items can follow after the first launch.
