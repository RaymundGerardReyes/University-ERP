import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AdmissionsWorkspacePage } from '../../../apps/admin-portal/src/features/AdmissionsProcessing/AdmissionsWorkspace.page';
import { admissionsApi } from '@university-erp/api-clients';

const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getPendingApplications: vi.fn(),
    verifyDocumentsAndForward: vi.fn(),
    recommendApplication: vi.fn(),
    endorseApplication: vi.fn(),
    activateEnrollment: vi.fn(),
    submitAcademicEvaluation: vi.fn()
  }
}));

describe("AdmissionsProcessing - Behavioral Regression Suite", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 }
      }
    });
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdmissionsWorkspacePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  describe("1. Secretary Intake Workflow Invariants", () => {
    it("should disable Verify & Forward button when ApplicationFeeStatus is Pending", async () => {
      mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
      vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([
        {
          id: 'APP-FEE-PENDING',
          applicantName: 'Bob Unpaid',
          program: 'BSCS',
          applicationFeeStatus: 'Pending',
          status: 'Submitted',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Uploaded',
          gpa: 3.8,
          chairpersonStatus: 'Pending',
          deanEndorsement: 'Pending'
        }
      ] as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Bob Unpaid')).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /Awaiting Payment/i });
      expect(button).toBeDisabled();
      expect(admissionsApi.verifyDocumentsAndForward).not.toHaveBeenCalled();
    });

    it("should enable Verify & Forward button when Fee is Paid and trigger API on click", async () => {
      mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
      vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([
        {
          id: 'APP-FEE-PAID',
          applicantName: 'Alice Paid',
          program: 'BSCS',
          applicationFeeStatus: 'Paid',
          status: 'Submitted',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Uploaded',
          gpa: 3.9,
          chairpersonStatus: 'Pending',
          deanEndorsement: 'Pending'
        }
      ] as any);
      vi.mocked(admissionsApi.verifyDocumentsAndForward).mockResolvedValue({ success: true } as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Alice Paid')).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /Verify & Forward/i });
      expect(button).toBeEnabled();

      fireEvent.click(button);

      await waitFor(() => {
        expect(admissionsApi.verifyDocumentsAndForward).toHaveBeenCalledWith('APP-FEE-PAID');
      });
    });
  });

  describe("2. Chairperson Academic Evaluation & Recommendation Invariants", () => {
    it("should render applicants under evaluation and dispatch recommendApplication on confirm", async () => {
      mockUseAuth.mockReturnValue({ user: { roles: ['Chairperson'] } });
      vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([
        {
          id: 'APP-CHAIR-01',
          applicantName: 'Charlie Candidate',
          program: 'BSCS',
          applicationFeeStatus: 'Paid',
          status: 'UnderAcademicEvaluation',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Verified',
          gpa: 3.75,
          chairpersonStatus: 'Pending',
          deanEndorsement: 'Pending'
        }
      ] as any);
      vi.mocked(admissionsApi.recommendApplication).mockResolvedValue({ success: true } as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Charlie Candidate')).toBeInTheDocument();
      });

      const evalButton = screen.getByRole('button', { name: /Evaluate/i });
      fireEvent.click(evalButton);

      await waitFor(() => {
        expect(screen.getByText(/Provide your formal recommendation for/i)).toBeInTheDocument();
      });

      const recommendBtn = screen.getByRole('button', { name: /Recommend to Dean/i });
      fireEvent.click(recommendBtn);

      await waitFor(() => {
        expect(admissionsApi.recommendApplication).toHaveBeenCalledWith(
          'APP-CHAIR-01',
          expect.stringContaining('Recommended')
        );
      });
    });
  });

  describe("3. College Dean Endorsement Invariants", () => {
    it("should filter to show only Recommended applications and dispatch endorseApplication", async () => {
      mockUseAuth.mockReturnValue({ user: { roles: ['Dean'] } });
      vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([
        {
          id: 'APP-DEAN-01',
          applicantName: 'David Recommended',
          program: 'BSCS',
          applicationFeeStatus: 'Paid',
          status: 'Recommended',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Verified',
          gpa: 3.85,
          chairpersonStatus: 'Recommended',
          deanEndorsement: 'Pending'
        },
        {
          id: 'APP-UNVETTED',
          applicantName: 'Eve Unvetted',
          program: 'BSCS',
          applicationFeeStatus: 'Paid',
          status: 'UnderAcademicEvaluation',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Verified',
          gpa: 3.5,
          chairpersonStatus: 'Pending',
          deanEndorsement: 'Pending'
        }
      ] as any);
      vi.mocked(admissionsApi.endorseApplication).mockResolvedValue({ success: true } as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('David Recommended')).toBeInTheDocument();
      });

      // Assert Eve Unvetted is NOT rendered in the Dean's queue
      expect(screen.queryByText('Eve Unvetted')).not.toBeInTheDocument();

      const endorseBtn = screen.getByRole('button', { name: /Endorse for Enrollment/i });
      fireEvent.click(endorseBtn);

      await waitFor(() => {
        expect(admissionsApi.endorseApplication).toHaveBeenCalledWith('APP-DEAN-01');
      });
    });
  });

  describe("4. Registrar Final Enrollment Activation Invariants", () => {
    it("should only render Endorsed applications and trigger activateEnrollment", async () => {
      mockUseAuth.mockReturnValue({ user: { roles: ['Registrar'] } });
      vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([
        {
          id: 'APP-REG-01',
          applicantName: 'Frank Endorsed',
          program: 'BSCS',
          applicationFeeStatus: 'Paid',
          status: 'Endorsed_For_Enrollment',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Verified',
          gpa: 3.9,
          chairpersonStatus: 'Recommended',
          deanEndorsement: 'Endorsed'
        },
        {
          id: 'APP-PREMATURE',
          applicantName: 'Grace Premature',
          program: 'BSCS',
          applicationFeeStatus: 'Paid',
          status: 'Recommended',
          submittedDate: '2026-09-01T00:00:00Z',
          documentsStatus: 'Verified',
          gpa: 3.9,
          chairpersonStatus: 'Recommended',
          deanEndorsement: 'Pending'
        }
      ] as any);
      vi.mocked(admissionsApi.activateEnrollment).mockResolvedValue({ success: true, studentId: 'STU-2026-9999' } as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Frank Endorsed')).toBeInTheDocument();
      });

      // Assert Grace Premature is NOT in the Registry queue
      expect(screen.queryByText('Grace Premature')).not.toBeInTheDocument();

      const activateBtn = screen.getByRole('button', { name: /Activate Enrollment/i });
      fireEvent.click(activateBtn);

      await waitFor(() => {
        expect(admissionsApi.activateEnrollment).toHaveBeenCalledWith('APP-REG-01');
      });
    });
  });
});
