#!/bin/sh
set -e

# -----------------------------------------------------------------------------
# University ERP - Database Restore Script
# -----------------------------------------------------------------------------
# Restores a specific backup artifact to the PostgreSQL database.

DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-universityerp}
BACKUP_DIR="/backups"

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_filename>"
    echo "Example: ./restore.sh erp_2026-08-20_020000.dump"
    echo "Available backups in ${BACKUP_DIR}:"
    ls -l "${BACKUP_DIR}"/*.dump
    exit 1
fi

BACKUP_FILENAME=$1
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

if [ ! -f "${BACKUP_PATH}" ]; then
    echo "❌ Backup file ${BACKUP_PATH} not found!"
    exit 1
fi

echo "🔍 Verifying checksum..."
cd "${BACKUP_DIR}"
if [ -f "${BACKUP_FILENAME}.sha256" ]; then
    sha256sum -c "${BACKUP_FILENAME}.sha256"
    if [ $? -ne 0 ]; then
        echo "❌ Checksum verification failed! The backup archive is corrupted."
        exit 1
    fi
    echo "✅ Checksum verified successfully."
else
    echo "⚠️ Warning: Checksum file not found. Proceeding without verification..."
fi

echo "⚠️ WARNING: This will drop the existing database '${DB_NAME}' and restore from '${BACKUP_FILENAME}'."
echo "Press Ctrl+C to abort, or wait 10 seconds to continue..."
sleep 10

echo "🔌 Dropping and recreating database ${DB_NAME}..."
# Drop and recreate database to ensure a clean slate (requires disconnecting active sessions)
export PGPASSWORD="${DB_PASSWORD}"
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}';"
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME};"

echo "♻️ Restoring database from archive..."
pg_restore -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -j 4 --clean "${BACKUP_PATH}"

echo "🎉 Restore process completed successfully!"
