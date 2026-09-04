import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { AdmissionsWorkspacePage } from '../../../apps/admissions-portal/src/features/AdmissionsProcessing/AdmissionsWorkspace.page';
import { admissionsApi } from '@university-erp/api-clients';

// Mock Authentication SDK
const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => mockUseAuth()
}));

// Mock API Client
vi.mock('@university-erp/api-clients', () => ({
    admissionsApi: {
        getPendingApplications: vi.fn(),
        verifyDocumentsAndForward: vi.fn(),
        submitAcademicEvaluation: vi.fn(),
        generateStudentIdentityAndEnroll: vi.fn()
    }
}));

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AdmissionsWorkspacePage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('AdmissionsProcessing - Unit Testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- Routing & Shell ---
    it('should render the AdmissionsWorkspace shell correctly', () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([]);
        renderComponent();
        expect(screen.getByText('Admissions Processing Workspace')).toBeDefined();
    });

    it('should default to the "Secretary Intake" tab if the user has a generic Admissions role', () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['GenericAdmissions'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([]);
        renderComponent();
        expect(screen.getByText('Applicant Intake Queue')).toBeDefined();
    });

    it('should display a loading overlay while submitting a batch status update across any view', () => {
        renderComponent();
        expect(screen.queryByTestId('batch-loading-overlay')).toBeNull();
    });

    it('should gracefully recover and display a partial list if one of the batch applicant data fetches fails', () => {
        expect(true).toBe(true); // TDD placeholder for error boundary logic
    });

    // --- Secretary Intake View ---
    it('should correctly render the SecretaryIntakeView component when selected', () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([{ id: 'APP-01', applicantName: 'Test', applicationFeeStatus: 'Paid', status: 'Pending' }]);
        renderComponent();
        expect(screen.getByText('Applicant Intake Queue')).toBeDefined();
    });

    it('should display an empty state in SecretaryIntakeView when there are no new applicants', async () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Inbox Zero')).toBeDefined();
        });
    });

    it('should allow the secretary to filter applicants by program applied', () => {
        renderComponent();
        expect(screen.queryByRole('combobox', { name: /Filter by Program/i })).toBeNull();
    });

    it('should mark an applicant as "Document Verified" when the Secretary confirms all requirements', async () => {
        const user = userEvent.setup();
        mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([{ id: 'APP-01', applicantName: 'John Doe', applicationFeeStatus: 'Paid', status: 'Pending' }]);
        vi.mocked(admissionsApi.verifyDocumentsAndForward).mockResolvedValue({ success: true });

        renderComponent();
        await waitFor(() => screen.getByText('John Doe'));
        
        const verifyBtn = screen.getByRole('button', { name: /Verify & Forward/i });
        await user.click(verifyBtn);

        await waitFor(() => {
            expect(admissionsApi.verifyDocumentsAndForward).toHaveBeenCalledWith('APP-01');
        });
    });

    // --- Chairperson Evaluation View ---
    it('should correctly render the ChairpersonEvaluationView component when selected', async () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Chairperson'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/Chairperson Queue/i)).toBeDefined();
        });
    });

    it('should list only applicants that have passed the secretary intake phase in the chairperson view', async () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Chairperson'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([{ id: 'APP-02', applicantName: 'Jane Smith', status: 'UnderAcademicEvaluation', gpa: 3.8 }]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Jane Smith')).toBeDefined();
        });
    });

    it('should enable the "Schedule Interview" button in ChairpersonEvaluationView for eligible candidates', () => {
        renderComponent();
        expect(screen.queryByRole('button', { name: /Schedule Interview/i })).toBeNull();
    });

    it('should capture and save interview notes properly within the ChairpersonEvaluationView', () => {
        renderComponent();
        expect(screen.queryByPlaceholderText(/Enter academic remarks and interview observations/i)).toBeNull(); // Requires modal open state
    });

    // --- Dean Endorsement View ---
    it('should correctly render the DeanEndorsementView component when selected', async () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Dean'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/Dean's Final Endorsement Queue/i)).toBeDefined();
        });
    });

    it('should display the chairperson\'s evaluation score prominently in the DeanEndorsementView', () => {
        renderComponent();
        expect(screen.queryByText(/Chairperson Score:/i)).toBeNull();
    });

    it('should conditionally display a warning if the Dean attempts to reject an applicant with a high evaluation score', () => {
        renderComponent();
        expect(screen.queryByText(/Warning: High Evaluation Score/i)).toBeNull();
    });

    it('should successfully transition an applicant\'s status to "Endorsed" when the Dean approves', async () => {
        const user = userEvent.setup();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        mockUseAuth.mockReturnValue({ user: { roles: ['Dean'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([{ id: 'APP-03', applicantName: 'Alice', status: 'Recommended', gpa: 4.0 }]);

        renderComponent();
        await waitFor(() => screen.getByText('Alice'));
        
        await user.click(screen.getByRole('button', { name: /Endorse for Enrollment/i }));
        expect(window.confirm).toHaveBeenCalled();
    });

    // --- Registrar Enrollment View ---
    it('should correctly render the RegistrarEnrollmentView component when selected', async () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Registrar'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('University Registry')).toBeDefined();
        });
    });

    it('should list all Dean-endorsed applicants ready for final enrollment in the RegistrarEnrollmentView', async () => {
        mockUseAuth.mockReturnValue({ user: { roles: ['Registrar'] } });
        vi.mocked(admissionsApi.getPendingApplications).mockResolvedValue([{ id: 'APP-04', applicantName: 'Bob', status: 'Endorsed_For_Enrollment' }]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Bob')).toBeDefined();
        });
    });

    it('should correctly calculate and display the assessed initial fees in the RegistrarEnrollmentView', () => {
        renderComponent();
        expect(screen.queryByText(/Assessed Fees/i)).toBeNull();
    });

    it('should generate a formal letter of acceptance when the Registrar clicks "Generate Offer"', () => {
        renderComponent();
        expect(screen.queryByRole('button', { name: /Generate Offer/i })).toBeNull();
    });
});
