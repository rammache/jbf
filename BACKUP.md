# PostgreSQL Backup & Disaster Recovery Guide

This guide documents the database backup and restoration procedures for the **Jabour Phone** e-commerce store.

---

## 1. Quick Commands

### Automated Backup via npm
```bash
cd backend
npm run db:backup
```
Backups are saved to `backend/backups/jabour_phone_backup_<timestamp>.sql`.

### Automated Restore via npm
Restores the most recent backup file:
```bash
cd backend
npm run db:restore
```

Or specify a specific backup file to restore:
```bash
npm run db:restore backend/backups/jabour_phone_backup_2026-11-19T14-00-00.sql
```

---

## 2. Docker Compose Commands

If running PostgreSQL via `docker-compose.yml`:

### Create Backup
```bash
docker compose exec -T db pg_dump -U postgres electro_db --clean --if-exists > "backend/backups/backup_$(date +%Y%m%d_%H%M%S).sql"
```

### Restore Backup
```bash
docker compose exec -T db psql -U postgres electro_db < "backend/backups/YOUR_BACKUP_FILE.sql"
```

---

## 3. Remote Production Commands (Railway / Render / VPS)

Using standard PostgreSQL CLI utilities and `DATABASE_URL`:

### Create Backup
```bash
pg_dump "$DATABASE_URL" --clean --if-exists --no-owner --no-privileges -F p -f "backup.sql"
```

### Compressed Backup (Recommended for large catalogs)
```bash
pg_dump "$DATABASE_URL" -F c -b -v -f "jabour_phone_production.dump"
```

### Restore Compressed Backup
```bash
pg_restore -d "$DATABASE_URL" --clean --if-exists -v "jabour_phone_production.dump"
```

---

## 4. Backup Retention Policy

| Frequency | Retention | Purpose |
| :--- | :--- | :--- |
| **Daily** | 7 Days | Fast recovery from accidental deletions or wrong status changes. |
| **Weekly** | 4 Weeks | Medium-term rollback checkpoint. |
| **Monthly** | 12 Months | Archival and financial reconciliation. |

---

## 5. Pre-Deployment & Maintenance Checklist

1. Always take a manual backup before running Prisma migrations:
   ```bash
   npm run db:backup
   ```
2. Verify backup integrity by inspecting file size and checking that it begins with valid SQL DDL statements (`CREATE TABLE`, `CREATE INDEX`).
3. Store backups on encrypted, off-site cloud storage (such as AWS S3 or Google Cloud Storage with versioning enabled).
