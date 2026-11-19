#!/usr/bin/env bash
# ==============================================================================
# Jabour Phone - Automated PostgreSQL Backup Script
# Run daily via cron to create timestamped compressed database backups.
#
# Recommended crontab entry (runs every night at 2:00 AM):
# 0 2 * * * /path/to/backend/scripts/cron-backup.sh >> /var/log/jabour-backup.log 2>&1
# ==============================================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/jabour-phone}"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="jabour_phone_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting automated database backup..."

if [ -n "${DATABASE_URL:-}" ]; then
  # Dump using DATABASE_URL
  pg_dump "${DATABASE_URL}" --clean --if-exists --no-owner --no-privileges | gzip > "${BACKUP_DIR}/${FILENAME}"
elif command -v docker > /dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q 'jabour_phone_postgres'; then
  # Dump from running Docker container
  docker exec -t jabour_phone_postgres pg_dump -U postgres jabour_phone_db --clean --if-exists | gzip > "${BACKUP_DIR}/${FILENAME}"
else
  # Fallback to local pg_dump
  PGPASSWORD="${POSTGRES_PASSWORD:-}" pg_dump -h localhost -U postgres -d jabour_phone_db --clean --if-exists | gzip > "${BACKUP_DIR}/${FILENAME}"
fi

BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup created: ${BACKUP_DIR}/${FILENAME} (${BACKUP_SIZE})"

# Delete backups older than retention threshold (30 days)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cleaning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "jabour_phone_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Automated backup completed successfully."
