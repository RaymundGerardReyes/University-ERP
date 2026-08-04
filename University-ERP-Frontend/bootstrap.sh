#!/usr/bin/env bash

set -e

# Ensure we are running inside the directory where the script is located
cd "$(dirname "$0")"
echo "========================================="
echo " University ERP Frontend Bootstrap"
echo "========================================="

echo ""
echo "[1/9] Cleaning previous installation..."

find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "package-lock.json" -delete

echo ""
echo "[2/9] Cleaning npm cache..."

npm cache verify

echo ""
echo "[3/9] Installing all workspace dependencies..."

npm install

echo ""
echo "[4/9] Deduplicating packages..."

npm dedupe || true

echo ""
echo "[5/9] Running audit..."

npm audit || true


echo ""
echo "[7/9] Running tests..."

npm run test --workspaces --if-present

echo ""
echo "[8/9] Building every application..."

npm run build --workspaces --if-present

echo ""
echo "[9/9] Listing installed workspaces..."

npm ls --workspaces

echo ""
echo "========================================="
echo " Bootstrap completed successfully!"
echo "========================================="