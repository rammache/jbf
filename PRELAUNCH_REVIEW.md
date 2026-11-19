# Jabour Phone - Pre-Launch Verification & Responsive Audit

This document summarizes the pre-launch testing checklist to ensure the store functions smoothly on all devices before going live.

---

## 📱 Mobile & Desktop Audit Checklist

### 1. Storefront Navigation & Header
- [x] **Sticky Announcement Bar:** Rotating promotional text displays without layout shift on mobile and desktop.
- [x] **Mobile Navigation Drawer:** Hamburger menu opens smoothly, lists all dynamic categories, and closes on backdrop tap or route change.
- [x] **Header Badges:** Cart counter and search icons maintain minimum 44px touch targets on iOS/Android.
- [x] **Live Search Modal:** Debounced product search opens as a full modal, highlights matches, and closes on `Esc` key or close button.

### 2. Homepage Showcase
- [x] **Hero Banner:** Dynamic featured hero displays real price, compare price, and high-impact CTA buttons; responsive layout stacks cleanly on mobile.
- [x] **Featured Departments Showcase:** Category cards with cover photos and hover animations; responsive 2-column grid on mobile, 4-column on desktop.
- [x] **Top Selling Grid:** Product cards show sale tags, dynamic currency, stock status, and quick add-to-cart button.
- [x] **Value Propositions:** Genuine Jabour Phone promises (100% Genuine, 1-Year Warranty, 14-Day Exchange, Beirut Showroom).

### 3. Catalog & Filtering (Shop Page)
- [x] **Category & Brand Filtering:** Dynamic checkboxes populated directly from database records.
- [x] **Price Slider:** Minimum and maximum price filtering with responsive sliders and instant query updates.
- [x] **Sorting:** Featured priority sort, price low-to-high, price high-to-low, and newest.
- [x] **Pagination:** Clean page controls with previous/next buttons.

### 4. Product Detail Page
- [x] **Photo Gallery:** Multi-image thumbnails with main preview; swipe-friendly and responsive.
- [x] **Phone Specifications Table:** Displays Screen, Battery, Camera, Storage, RAM, Processor, Condition, and Warranty.
- [x] **Stock Guard:** When inventory is 0, button displays "Out of Stock" and is disabled; quantity stepper is capped at available stock.
- [x] **WhatsApp Order Button:** Direct chat button opening WhatsApp with pre-filled message: *"Hello Jabour Phone, I am interested in purchasing [Product Title] ($[Price]). Is it available for delivery?"*

### 5. Cart Drawer & Checkout Flow
- [x] **Cart Drawer:** Quantity increment/decrement, line item removal, subtotal calculation, and dynamic free shipping progress bar.
- [x] **Checkout Modal:**
  - Full Name, Customer Email, Contact Phone (required with validation).
  - City and Street Delivery Address.
  - Cash on Delivery (COD) selected by default with courier inspection guarantee note.
  - Coupon code input with instant validation and discount deduction.
  - Server-side authoritative price recalculation (tamper-proof).
- [x] **Order Confirmation:** Displays unique order number (`JP-YYMM-XXXX`), order breakdown, and WhatsApp order tracking link.

### 6. Admin Panel (Desktop & Tablet)
- [x] **Responsive Admin Layout:** Collapsible sidebar with navigation pills, active path highlighting, and header sign-out.
- [x] **KPI Overview Dashboard:** Real-time metrics, order pipeline badges, top products, low stock warnings, and profit report modal.
- [x] **Categories Management:** Reordering, active toggles, image upload, and deletion protection with product reassignment.
- [x] **Products Management:** Filterable table with image thumbnails, bulk activate/deactivate/delete, and tabbed create/edit modal.
- [x] **Orders Management:** Status transitions with automatic inventory restoration on cancellation, packing slip printing, and direct WhatsApp customer contact.
- [x] **Newsletter:** Email list with search and RFC 4180 compliant CSV export.
- [x] **Settings:** Dynamic store profile, shipping fee rules, social links, and admin password change.

---

## 🚀 Pre-Launch Smoke Test Checklist

Before pointing your official domain to the live server:
1. [x] Run `npm test` from root -> Verify 100% test pass rate across both apps.
2. [x] Run `npm run build` from root -> Verify clean production builds with 0 errors.
3. [x] Verify `.gitignore` -> Confirm no `.env`, passwords, or private keys are tracked.
4. [x] Verify `/health/ping` -> Confirm HTTP 200 response.
5. [x] Verify `/health` -> Confirm database latency < 50ms.
6. [x] Submit a test Cash on Delivery order -> Confirm order receipt, admin email log, and inventory decrement.
7. [x] Log into `/admin/login` -> Confirm admin access and change temporary password.
