# Jabour Phone - Production Deployment Guide

This guide details how to deploy the **Jabour Phone** e-commerce platform to production.

---

## Architecture Overview

Jabour Phone supports two deployment architectures:

1. **Unified Single-Domain Deployment (Recommended):**
   - The compiled React frontend (`frontend/dist`) is served directly by the Express backend.
   - Zero cross-origin (CORS) complexity; cookies are automatically `same-origin`.
   - Runs in a single lightweight container or process on port 5000.
   - Ideal for **Railway**, **Render**, or **VPS (Docker Compose)**.

2. **Split-Domain Deployment:**
   - Frontend is hosted on **Vercel** / **Cloudflare Pages** (static CDN).
   - Backend API is hosted on **Railway** / **Render** / **VPS**.
   - `FRONTEND_URL` in backend `.env` is set to `https://jabourphone.com`.
   - `VITE_API_BASE_URL` in frontend `.env` is set to `https://api.jabourphone.com`.

---

## Option 1: One-Click / CLI Deployment on Railway (Easiest)

Railway provides managed PostgreSQL and automatic container builds with zero server maintenance.

### Steps:
1. **Create a Railway Project:**
   - Go to [Railway.app](https://railway.app) and create a new project.
2. **Add PostgreSQL Database:**
   - Click **+ New** -> **Database** -> **Add PostgreSQL**.
   - Railway will provision PostgreSQL 16 and generate the `DATABASE_URL`.
3. **Deploy the Jabour Phone Application:**
   - Click **+ New** -> **GitHub Repo** -> select the `jabour-phone` repository.
   - Railway detects the root `Dockerfile`.
4. **Configure Environment Variables:**
   Under service **Variables**, add:
   ```env
   NODE_ENV=production
   PORT=5000
   SERVE_FRONTEND=true
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=use-a-random-32-char-string-or-railway-generated-secret
   FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
   ADMIN_EMAIL=jabour@jabourphone.com
   ADMIN_PASSWORD=YourStrongAdminPassword2026!
   ```
5. **Attach Persistent Storage for Uploads:**
   - In Railway dashboard, go to **Settings** -> **Volumes** -> **Add Volume**.
   - Mount path: `/app/uploads`.
6. **Initialize Database & Create Admin:**
   - Open the Railway CLI or web terminal and run:
     ```bash
     npm run prod:init --prefix backend
     ```
   - This applies all database migrations and seeds the standard categories and initial Super Admin.

---

## Option 2: Deployment on Render

Render supports automated infrastructure provisioning using the included `render.yaml` blueprint.

### Steps:
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **Blueprints** -> **New Blueprint Instance**.
3. Connect your repository. Render automatically reads `render.yaml` and provisions:
   - A managed PostgreSQL 16 database (`jabour-phone-db`).
   - A Docker web service running the unified container on port 5000.
4. Set the `FRONTEND_URL` environment variable to your Render domain (or custom domain).
5. Attach a Render Disk:
   - Mount Path: `/app/uploads` (Size: 10 GB).
6. Run the production migration and seed:
   - In the Render Shell tab, run:
     ```bash
     npm run prod:init --prefix backend
     ```

---

## Option 3: VPS / Ubuntu Deployment (Docker Compose + Caddy)

For dedicated Linux VPS servers (Hetzner, DigitalOcean, Linode, AWS EC2).

### Prerequisites:
- Ubuntu 22.04 / 24.04 LTS
- Docker & Docker Compose installed
- A domain pointed to your VPS IP (`jabourphone.com`)

### 1. Clone & Setup Environment
```bash
git clone https://github.com/your-org/jabour-phone.git /var/www/jabour-phone
cd /var/www/jabour-phone

# Create production .env file
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your production values:
```env
NODE_ENV=production
PORT=5000
SERVE_FRONTEND=true
POSTGRES_PASSWORD=generate_a_strong_db_password
DATABASE_URL=postgresql://postgres:generate_a_strong_db_password@postgres:5432/jabour_phone_db?schema=public
JWT_SECRET=generate_at_least_32_characters_random_hex
FRONTEND_URL=https://jabourphone.com
ADMIN_EMAIL=jabour@jabourphone.com
ADMIN_PASSWORD=JabourPhone2026!Secure
```

### 2. Start Application with Docker Compose
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 3. Run Migrations & Initial Seed
```bash
docker compose -f docker-compose.prod.yml exec app npm run prod:init --prefix backend
```

### 4. Automatic HTTPS Reverse Proxy with Caddy
Install Caddy (provides free automatic Let's Encrypt SSL certificates):
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Create `/etc/caddy/Caddyfile`:
```caddy
jabourphone.com, www.jabourphone.com {
    reverse_proxy localhost:5000
    encode gzip zstd
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```
Your store is now live with automatic HTTPS!

---

## Option 4: Full-Stack Vercel Deployment (Frontend + Backend on Vercel)

This project is pre-configured with Vercel Multi-Services (`vercel.json`), allowing both the **Vite React Frontend** and **Express REST API Backend** to run together on Vercel under a single domain.

### 1. Database (Neon PostgreSQL)
Vercel serverless functions require an external hosted PostgreSQL database. We use **Neon Serverless PostgreSQL**:
- Ensure your Neon connection strings are ready (found in `backend/.env`):
  - `DATABASE_URL`: Pooled connection string with `?sslmode=require&pgbouncer=true`.
  - `DIRECT_URL`: Direct unpooled connection string with `?sslmode=require`.
- Deploy the database schema before deploying:
  ```bash
  npm run prisma:deploy --prefix backend
  # Optional: Seed initial categories and super admin
  npm run prisma:seed --prefix backend
  ```

### 2. Connect Repository to Vercel
1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Go to the [Vercel Dashboard](https://vercel.com/new) and click **"Add New..." -> "Project"**.
3. Import your GitHub repository (`jbf`).
4. Keep the **Root Directory** as `./` (Root). Vercel reads `vercel.json` and automatically builds both `frontend` and `backend`.

### 3. Configure Environment Variables in Vercel
In the Vercel project configuration screen (under **Environment Variables**), add the following:
```env
DATABASE_URL=your_pooled_neon_connection_string
DIRECT_URL=your_direct_neon_connection_string
JWT_SECRET=your_32_plus_char_random_jwt_secret
NODE_ENV=production
ADMIN_EMAIL=jabour@jabourphone.com
ADMIN_PASSWORD=YourStrongAdminPassword2026!
```

> **Note on Image Uploads:** Because Vercel functions have an ephemeral filesystem (`/tmp`), local uploads are not permanent. For persistent product/category photos, add your free **Cloudinary** credentials:
> ```env
> CLOUDINARY_CLOUD_NAME=your_cloud_name
> CLOUDINARY_API_KEY=your_api_key
> CLOUDINARY_API_SECRET=your_api_secret
> ```

### 4. Deploy
Click **Deploy**. Vercel will build both services:
- `/` and all storefront routes are served instantly by the fast Vite static CDN.
- `/api/*`, `/health`, and `/uploads/*` are automatically routed to the Express API.
- Zero CORS or third-party cookie issues because frontend and backend run on the exact same domain!

---

## Option 5: Split Hosting (Vercel Frontend + Railway/Render Backend)

1. **Deploy Backend on Railway or Render:**
   - Configure `FRONTEND_URL=https://jabourphone.com`.
   - Run `npm run prod:init --prefix backend`.
2. **Deploy Frontend on Vercel:**
   - Root directory: `frontend`.
   - Build command: `npm run build`.
   - Output directory: `dist`.
   - Environment Variable: `VITE_API_BASE_URL=https://api.jabourphone.com`.

---

## Upload Persistence: Cloudinary (Optional Cloud Storage)

If you prefer cloud image hosting instead of a mounted volume disk:
1. Sign up for a free account at [Cloudinary.com](https://cloudinary.com).
2. Add these variables to your backend environment:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. When set, product photos and category images automatically upload directly to Cloudinary's worldwide CDN!

---

## Production Maintenance & Backups

### Automated Database Backups
Configure a nightly cron job to dump and compress the database:
```bash
chmod +x backend/scripts/cron-backup.sh
crontab -e
```
Add:
```cron
0 2 * * * /var/www/jabour-phone/backend/scripts/cron-backup.sh >> /var/log/jabour-backup.log 2>&1
```

### Health Check Monitoring
Add your `/health/ping` URL (e.g. `https://jabourphone.com/health/ping`) to a free uptime monitor such as [UptimeRobot](https://uptimerobot.com) or [BetterStack](https://betterstack.com).
