
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
echo "[3.5/9] Validating strict workspace hoisting..."

# Find any node_modules inside apps/ or libs/ (maxdepth 2 to avoid scanning inside nested modules if they exist)
NESTED_MODULES=$(find ./apps ./libs -maxdepth 2 -name "node_modules" -type d)

if [ -n "$NESTED_MODULES" ]; then
    echo "❌ ERROR: Strict workspace hoisting failed!"
    echo "NPM created nested node_modules in the following directories because of version conflicts:"
    echo "$NESTED_MODULES"
    echo ""
    echo "Rule Violation: All dependencies MUST be placed in the root node_modules."
    echo "Please align the dependency versions across your package.json files so NPM can successfully hoist them."
    exit 1
fi
echo "✅ Strict hoisting verified. No nested node_modules found."

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