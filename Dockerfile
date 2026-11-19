# ==============================================================================
# Jabour Phone Full-Stack Unified Production Dockerfile
# Serves both Frontend (SPA) and Backend (REST API) on a single port.
# Ideal for Railway, Render, Fly.io, or VPS deployments.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY backend/src ./src
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV SERVE_FRONTEND=true
ENV FRONTEND_DIST_PATH=/app/frontend/dist
ENV UPLOADS_DIR=/app/uploads

# Install production dependencies for backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy compiled backend and generated prisma client
COPY --from=backend-builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /app/backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Create persistent uploads directory and set permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node
WORKDIR /app/backend

EXPOSE 5000

# Health check probing /health/ping
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health/ping || exit 1

CMD ["node", "dist/server.js"]
