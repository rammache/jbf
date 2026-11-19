# Jabour Phone E-Commerce Platform

A high-performance modern e-commerce web application for **Jabour Phone**, built on Colorlib's **Electro 3.0.0** theme and rebuilt as a full-stack production application.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + Lucide Icons + React Router DOM
- **Backend**: Express.js (Node.js) + TypeScript + REST API
- **Database**: PostgreSQL
- **ORM**: Prisma ORM

---

## 📁 Project Architecture

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma data models (Product, Category, Order, OrderItem, Newsletter)
│   │   ├── seed.ts              # Safe, non-destructive seed (no demo data)
│   │   └── demo-seed.ts         # Guarded local demo catalog (refuses to run in production)
│   ├── src/
│   │   ├── controllers/         # Express controllers (products, categories, orders, newsletter)
│   │   ├── routes/              # Express API route declarations
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── server.ts            # Main Express app & CORS configuration
│   ├── docker-compose.yml       # Ready-to-run PostgreSQL 16 container
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnouncementBar.tsx   # Rotating announcement ticker banner
│   │   │   ├── Navbar.tsx            # Sticky header with navigation, drawer toggles & cart badge
│   │   │   ├── ProductCard.tsx       # Product listing card with Sale badge, swatches & Quick Add
│   │   │   ├── CartDrawer.tsx        # Slide-over shopping basket with quantity steppers & totals
│   │   │   ├── SearchModal.tsx       # Live predictive search modal matching the template index
│   │   │   ├── CheckoutModal.tsx     # Order checkout form connected to PostgreSQL via Prisma
│   │   │   └── Footer.tsx            # Brand footer with newsletter subscription API integration
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Hero banner, department tabs, highest rated, bench story
│   │   │   ├── Shop.tsx              # Faceted catalog (categories, brand, price slider & sorting)
│   │   │   ├── ProductDetail.tsx     # Gallery thumbnails, finish picker, bench specs & related items
│   │   │   └── About.tsx             # Bench test philosophy & transparency statement
│   │   ├── context/
│   │   │   └── CartContext.tsx       # LocalStorage shopping cart state management
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   ├── App.tsx                   # Routes and application layout
│   │   └── index.css                 # Montserrat font & Tailwind styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
```

---

## 🚀 Getting Started

### 1. Database (PostgreSQL)

You can launch a PostgreSQL instance with Docker:

```bash
cd backend
docker compose up -d
```

Or connect your existing PostgreSQL database by setting `DATABASE_URL` in `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/electro_db?schema=public"
```

Admin auth also requires a `JWT_SECRET` in `backend/.env` (see `backend/.env.example`).

### 2. Backend Setup & Seeding

```bash
cd backend
npm install

# Push Prisma schema to your PostgreSQL database
npm run prisma:push

# Run the safe seed (non-destructive; currently no base data)
npm run prisma:seed

# Optional, local development only: load the 15 demo products & 4 demo categories
npm run prisma:seed:demo

# Start the Express API server
npm run dev
```

The Express API will run on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will run on `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Query products with `category`, `brand`, `minPrice`, `maxPrice`, `q`, and `sort` |
| `GET` | `/api/products/:handle` | Fetch single product specification and 4 related department products |
| `GET` | `/api/categories` | Retrieve all product departments |
| `GET` | `/api/brands` | Retrieve distinct hardware manufacturers |
| `POST` | `/api/orders` | Place a customer order and create order items in PostgreSQL |
| `GET` | `/api/orders/:id` | Lookup existing order receipt by UUID |
| `POST` | `/api/newsletter` | Register customer email for restocking updates |
| `POST` | `/api/auth/login` | Sign in an admin; sets an httpOnly JWT cookie |
| `GET` | `/api/auth/me` | Return the currently signed-in admin |
| `POST` | `/api/auth/logout` | Clear the admin auth cookie |
