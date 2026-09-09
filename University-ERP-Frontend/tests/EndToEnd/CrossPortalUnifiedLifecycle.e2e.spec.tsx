import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// 1. Core Cross-Portal Page Controllers
import { AcademicConfigurationPage } from '../../apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.page';
import { DashboardPage as StudentDashboardPage } from '../../apps/student-portal/src/features/Dashboard/Dashboard.page';
import { TuitionAssessmentPage } from '../../apps/finance-console/src/features/TuitionAssessment/TuitionAssessment.page';
import { DashboardPage as FinanceDashboardPage } from '../../apps/finance-console/src/features/Dashboard/Dashboard.page';
import { EnrollmentValidationPage } from '../../apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentValidation.page';
import { SystemLogsPage } from '../../apps/platform-console/src/features/SystemLogs/SystemLogs.page';
import { AccreditationPage } from '../../apps/governance-console/src/features/Accreditation/Accreditation.page';

// 2. Mock Authentication with Multi-Role Enterprise Identity
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: {
      id: 'USR-MASTER-SUPERADMIN',
      name: 'Dr. Evelyn Cross',
      role: 'AcademicAdmin',
      roles: ['AcademicAdmin', 'Admin', 'SuperAdmin', 'ROLE_REGISTRAR', 'ROLE_STUDENT', 'ROLE_FINANCE_OFFICER']
    },
    identity: {
      id: 'USR-MASTER-SUPERADMIN',
      roles: ['AcademicAdmin', 'Admin', 'SuperAdmin', 'ROLE_REGISTRAR', 'ROLE_STUDENT', 'ROLE_FINANCE_OFFICER']
    },
    isAuthenticated: true
  })
}));

// 3. Mock API Clients
vi.mock('../../apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.api', () => ({
  fetchAcademicConfig: vi.fn().mockResolvedValue({
    activeTerm: 'First Semester 2026-2027',
    isLateEnrollmentAllowed: true,
    isTermOpen: true,
    academicYear: '2026-2027'
  }),
  updateAcademicConfig: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('@university-erp/api-clients', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    registrarApi: {
      ...actual.registrarApi,
      getEnrollmentValidationQueue: vi.fn().mockResolvedValue([
        {
          id: 'VAL-2026-0042',
          studentId: 'STU-2026-0042',
          studentName: 'Alexandria Vance',
          fullName: 'Alexandria Vance',
          units: 21,
          status: 'Pending Review'
        }
      ])
    }
  };
});

describe("Unified Cross-Portal Enterprise Lifecycle E2E Suite", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity }
      }
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement, initialRoute = "/") => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  // Phase 1: Admin Portal Term Configuration
  it("Phase 1: Academic Administrator initiates and configures active semester in Admin Portal", async () => {
    renderWithProviders(<AcademicConfigurationPage />);

    await waitFor(() => {
      expect(screen.getByText("Academic Configuration")).toBeInTheDocument();
      expect(screen.getByText("First Semester 2026-2027")).toBeInTheDocument();
      expect(screen.getByText("CURRENT TERM")).toBeInTheDocument();
    });

    const toggle = screen.getByRole("checkbox", { name: /Late Enrollment Allowed/i });
    expect(toggle).toBeChecked();
  });

  // Phase 2: Student Academic Dashboard & Advising
  it("Phase 2: Student logs in to Student Portal and inspects academic standing and enrolled units", async () => {
    renderWithProviders(<StudentDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Student Academic Dashboard")).toBeInTheDocument();
      expect(screen.getByText(/Alexandria Vance/i)).toBeInTheDocument();
      expect(screen.getByText("3.85")).toBeInTheDocument();
      expect(screen.getByText(/Dean's List/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/CS-302: Distributed Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Hall 401/i)).toBeInTheDocument();
  });

  // Phase 3: Finance Console Tuition Assessment & Treasury Reconciliation
  it("Phase 3: Finance Office assesses tuition fees and evaluates student clearance in Finance Console", async () => {
    renderWithProviders(<TuitionAssessmentPage />);

    await waitFor(() => {
      expect(screen.getByText("Tuition Assessment")).toBeInTheDocument();
      expect(screen.getByText("STU-2026-8812")).toBeInTheDocument();
      expect(screen.getByText("Michael Corleone")).toBeInTheDocument();
    });

    // Verify fee calculations and deductions
    expect(screen.getByText("$2010.00")).toBeInTheDocument();
    expect(screen.getByText("-$500")).toBeInTheDocument();
  });

  it("Phase 3b: Treasury Officer reviews financial dashboard collections and pending clearances", async () => {
    renderWithProviders(<FinanceDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Finance and Treasury Dashboard")).toBeInTheDocument();
      expect(screen.getByText(/Collections \(YTD\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Outstanding Receivables/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Clearances/i)).toBeInTheDocument();
    });
  });

  // Phase 4: Registrar Portal Official Enrollment Confirmation
  it("Phase 4: Registrar validates academic load against prerequisites in Registrar Portal", async () => {
    renderWithProviders(<EnrollmentValidationPage />);

    await waitFor(() => {
      expect(screen.getByText("Enrollment Validation")).toBeInTheDocument();
      expect(screen.getAllByText("Alexandria Vance")[0]).toBeInTheDocument();
      expect(screen.getAllByText("STU-2026-0042")[0]).toBeInTheDocument();
    });
  });

  // Phase 5: Platform Console Distributed Observability & Logs
  it("Phase 5: DevOps and Platform Team inspects distributed OpenTelemetry trace logs in Platform Console", async () => {
    renderWithProviders(<SystemLogsPage />);

    await waitFor(() => {
      expect(screen.getByText("System and Application Logs")).toBeInTheDocument();
      expect(screen.getByText("UniversityErp.Academic.Enrollment")).toBeInTheDocument();
      expect(screen.getByText("UniversityErp.Administration.Finance")).toBeInTheDocument();
      expect(screen.getByText("UniversityErp.Platform.OutboxPublisher")).toBeInTheDocument();
    });
  });

  // Phase 6: Governance Console Accreditation & Regulatory Reporting
  it("Phase 6: Quality Office verifies CHED accreditation compliance criteria in Governance Console", async () => {
    renderWithProviders(<AccreditationPage />);

    await waitFor(() => {
      expect(screen.getByText("Accreditation Management")).toBeInTheDocument();
      expect(screen.getByText("Faculty-Student Ratio Compliance")).toBeInTheDocument();
      expect(screen.getByText("91.2%")).toBeInTheDocument();
    });
  });
});
