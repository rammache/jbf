# Jabour Phone - Uptime & Error Monitoring Guide

Reliable uptime and proactive error detection ensure customers can always shop and Jabour never misses an order.

---

## 1. Health Check Endpoints

The Jabour Phone API provides two dedicated monitoring endpoints:

### A. Lightweight Ping Endpoint
- **URL:** `GET /health/ping` (or `GET /api/health/ping`)
- **Response:** `200 OK`
  ```json
  {
    "status": "ok",
    "service": "Jabour Phone API",
    "timestamp": "2026-11-19T15:30:00.000Z"
  }
  ```
- **Use Case:** Configured in Docker `HEALTHCHECK`, cloud load balancers, and external 60-second uptime monitors (UptimeRobot, BetterStack, Pingdom).

### B. Detailed Diagnostic Health Endpoint
- **URL:** `GET /health` (or `GET /api/health`)
- **Response (when healthy):** `200 OK`
  ```json
  {
    "status": "healthy",
    "service": "Jabour Phone API",
    "timestamp": "2026-11-19T15:30:00.000Z",
    "uptimeSeconds": 14250,
    "database": {
      "status": "connected",
      "latencyMs": 4
    },
    "system": {
      "nodeVersion": "v20.18.0",
      "memory": {
        "heapUsed": "42.15 MB",
        "heapTotal": "85.20 MB",
        "rss": "120.40 MB"
      }
    },
    "environment": "production"
  }
  ```
- **Response (when database is degraded):** `503 Service Unavailable`
  ```json
  {
    "status": "degraded",
    "service": "Jabour Phone API",
    "database": {
      "status": "disconnected",
      "latencyMs": 102,
      "error": "Connection timeout"
    }
  }
  ```
- **Use Case:** Diagnostics, internal alerting, and checking database latency.

---

## 2. Setting Up Free 24/7 Uptime Monitoring

We recommend setting up a free monitoring account with **BetterStack** or **UptimeRobot**:

### Setup with BetterStack (Recommended)
1. Go to [betterstack.com](https://betterstack.com) and create a free account.
2. Click **Create Monitor**.
3. Settings:
   - **URL to monitor:** `https://your-domain.com/health/ping`
   - **Check frequency:** Every 1 minute or 3 minutes.
   - **Alert via:** Email, SMS, or WhatsApp.
4. BetterStack will alert you immediately if the store ever becomes unreachable.

### Setup with UptimeRobot
1. Go to [uptimerobot.com](https://uptimerobot.com).
2. Click **Add New Monitor**.
3. **Monitor Type:** HTTP(s).
4. **URL:** `https://your-domain.com/health/ping`.
5. **Monitoring Interval:** 5 minutes (free tier).

---

## 3. Server Logging & Error Auditing

In production, all requests and exceptions are structured and logged:
- **Request Logger:** Logs method, URL, HTTP status code, latency (ms), and client IP.
- **Central Error Handler:** Catches operational errors, validation failures, database constraint violations, and logs stack traces.

### Checking Docker Logs
```bash
docker logs -f jabour_phone_app --tail 100
```

### Checking Linux Systemd / Caddy Logs
```bash
journalctl -u caddy -f --no-pager
```

---

## 4. Graceful Shutdown & Zero-Downtime Deploys

The Express server handles `SIGTERM` and `SIGINT` gracefully:
1. Stops accepting new inbound HTTP requests.
2. Allows in-flight customer checkout requests up to 10 seconds to finish.
3. Closes Prisma PostgreSQL database connection pools cleanly.
4. Exits with code 0.
