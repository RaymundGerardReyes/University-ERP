#!/bin/sh
set -e

# -----------------------------------------------------------------------------
# University ERP - Automated Database Backup Script
# -----------------------------------------------------------------------------
# This script creates a timestamped compressed backup of the PostgreSQL database,
# generates a SHA256 checksum, maintains local retention, and optionally syncs
# to an off-host S3 destination.

DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-universityerp}

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
BACKUP_FILENAME="erp_${TIMESTAMP}.dump"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

echo "🚀 Starting database backup process at ${TIMESTAMP}..."

# 1. Create the backup using custom format (allows selective pg_restore)
PGPASSWORD="${DB_PASSWORD}" pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -F c -f "${BACKUP_PATH}" "${DB_NAME}"

if [ $? -eq 0 ]; then
    echo "✅ Backup successfully created at ${BACKUP_PATH}"
else
    echo "❌ Backup failed!"
    exit 1
fi

# 2. Generate SHA256 checksum
cd "${BACKUP_DIR}"
sha256sum "${BACKUP_FILENAME}" > "${BACKUP_FILENAME}.sha256"
echo "✅ Checksum generated."

# 3. Write metadata file
cat <<EOF > "${BACKUP_FILENAME}.metadata.json"
{
  "timestamp": "${TIMESTAMP}",
  "database": "${DB_NAME}",
  "format": "custom",
  "app_version": "${APP_VERSION:-latest}"
}
EOF
echo "✅ Metadata generated."

# 4. Local Retention Policy (Keep last 7 days)
echo "🧹 Cleaning up local backups older than 7 days..."
find "${BACKUP_DIR}" -name "erp_*.dump*" -type f -mtime +7 -delete

# 5. Off-Host Sync (Disaster Recovery)
if [ -n "${S3_BACKUP_BUCKET}" ]; then
    echo "☁️ Syncing backups to S3 (${S3_BACKUP_BUCKET})..."
    aws s3 sync "${BACKUP_DIR}" "s3://${S3_BACKUP_BUCKET}/" --exclude "*" --include "erp_${TIMESTAMP}.*" --no-progress
    echo "✅ Off-host sync complete."
else
    echo "⚠️ S3_BACKUP_BUCKET not set. Skipping off-host backup. WARNING: Local backups do NOT provide full Disaster Recovery."
fi

echo "🎉 Backup process completed successfully!"
