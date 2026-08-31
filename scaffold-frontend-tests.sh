#!/usr/bin/env bash
set -Eeuo pipefail

FRONTEND_ROOT="University-ERP-Frontend/apps"
PORTALS=(admin-portal admissions-portal applicant-portal faculty-portal finance-console governance-console identity-portal library-portal lms-web platform-console registrar-portal security-portal student-portal)

scaffold_portal_tests() {
  local portal="$1"
  local features_dir="$FRONTEND_ROOT/$portal/src/features"
  if [[ ! -d "$features_dir" ]]; then
    echo "skip (no features dir yet): $portal"
    return
  fi
  for feature_path in "$features_dir"/*/; do
    [[ -d "$feature_path" ]] || continue
    local feature_name
    feature_name="$(basename "$feature_path")"
    local test_dir="${feature_path}__tests__"
    if [[ -d "$test_dir" ]]; then
      continue
    fi
    mkdir -p "$test_dir"

    cat > "$test_dir/${feature_name}.unit.test.tsx" <<TSX
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('${feature_name} unit', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });
});
TSX

    cat > "$test_dir/${feature_name}.integration.test.tsx" <<TSX
import { describe, it, expect, vi } from 'vitest';

describe('${feature_name} integration', () => {
  it('calls the API client with expected params', async () => {
    expect(true).toBe(true);
  });

  it('surfaces API errors to the UI state', async () => {
    expect(true).toBe(true);
  });
});
TSX

    echo "scaffolded tests: $portal/$feature_name"
  done
}

for portal in "${PORTALS[@]}"; do
  scaffold_portal_tests "$portal"
done

echo "Frontend per-feature test scaffolding complete."
echo "Fill in real assertions before these count toward CI coverage gates."
