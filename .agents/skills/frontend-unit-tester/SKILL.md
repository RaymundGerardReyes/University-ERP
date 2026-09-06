---
name: frontend-unit-tester
description: >-
  Executes, diagnoses, and debugs Vitest unit tests across all 14 frontend applications and 9 shared libraries in University-ERP-Frontend. Use when the user asks to run, fix, or verify frontend unit tests.
---

# Frontend Unit Tester Skill

This skill provides comprehensive instructions, commands, and diagnostic procedures for executing and troubleshooting frontend unit tests across all 14 portals and shared libraries in `University-ERP-Frontend`.

---

## 1. Directory Context & Prerequisites

All test commands must be run from the frontend root:
```powershell
cd D:\University-ERP\University-ERP-Frontend
```

Dependencies are hoisted to root `node_modules/`. Verify Vitest is present:
```powershell
npx vitest --version
```

---

## 2. Test Execution Commands

### Run Full Test Suite (All 276 Test Files)
```powershell
npx vitest run tests/Unit
```

### Run Tests for a Specific Portal
Target any of the 14 portals:

```powershell
# Admissions & Applicant
npx vitest run tests/Unit/admissions-portal
npx vitest run tests/Unit/applicant-portal

# Academic & Teaching
npx vitest run tests/Unit/faculty-portal
npx vitest run tests/Unit/registrar-portal
npx vitest run tests/Unit/lms-web
npx vitest run tests/Unit/student-portal

# Administration & Finance
npx vitest run tests/Unit/admin-portal
npx vitest run tests/Unit/finance-console
npx vitest run tests/Unit/library-portal

# Platform & Security
npx vitest run tests/Unit/governance-console
npx vitest run tests/Unit/identity-portal
npx vitest run tests/Unit/platform-console
npx vitest run tests/Unit/security-portal
```

### Run Tests for Shared Libraries
```powershell
npx vitest run tests/Unit/libs
npx vitest run tests/Unit/libs/ui-kit
npx vitest run tests/Unit/libs/workflow-sdk
```

### Run a Single Specific Test File
```powershell
npx vitest run tests/Unit/admissions-portal/AdmissionCases.unit.test.tsx
```

### Run in Watch Mode During Development
```powershell
npx vitest tests/Unit/admissions-portal/AdmissionCases.unit.test.tsx
```

---

## 3. Diagnostic Guide for Common Failures

### Pattern 1: `Invalid Chai property: toBeDisabled` or `toBeInTheDocument`
- **Root Cause**: The test uses DOM assertions without registering `@testing-library/jest-dom` matchers.
- **Resolution**:
  Ensure the import is present at the top of the test file:
  ```ts
  import '@testing-library/jest-dom';
  ```

### Pattern 2: `useAuth must be used within an AuthProvider`
- **Root Cause**: The component or guard under test calls `useAuth()` without an `AuthProvider` wrapper or mock.
- **Resolution**:
  Add the standard mock at the top of the test file before rendering:
  ```tsx
  vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
      user: { id: 'usr-001', name: 'Test User', role: 'Staff' },
      identity: { id: 'usr-001', email: 'test@university.edu' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    }),
    RegistrarGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    FacultyGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    IdentityGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    FinanceGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    LMSGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));
  ```

### Pattern 3: Ambiguous Text Queries (`Found multiple elements with text: ...`)
- **Root Cause**: `getByText('Active')` finds both a status dropdown `<option>` and a `<Badge>Active</Badge>`.
- **Resolution**:
  Target the element by accessible role or container:
  ```tsx
  // Target specifically the badge
  expect(container.querySelector('.badge-success')).toHaveTextContent('Active');
  // Or target the specific option
  expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument();
  ```

### Pattern 4: Button Name Mismatch
- **Root Cause**: Test expects old button copy (e.g. `Accept Admission Offer`) while UI renders updated copy (e.g. `Accept Offer & Reserve Seat`).
- **Resolution**:
  Use flexible regex matchers:
  ```tsx
  expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
  ```

---

## 4. Helper Script

A PowerShell runner is provided at `.agents/skills/frontend-unit-tester/scripts/run-tests.ps1`:
```powershell
# Run with portal parameter
powershell -ExecutionPolicy Bypass -File .agents/skills/frontend-unit-tester/scripts/run-tests.ps1 -Portal admissions-portal
```
