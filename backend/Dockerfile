# ==============================================================================
# Jabour Phone Backend - Production Dockerfile
# ==============================================================================
# Stage 1: Build & Compile
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# Copy source code and compile
COPY src ./src
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy generated Prisma engine client and compiled JavaScript
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create uploads directory and assign ownership
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health/ping || exit 1

CMD ["node", "dist/server.js"]
