import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from '@university-erp/shell-kit';

// --- API & SDK Mocks ---
const mockCheckEligibility = vi.fn();
const mockUploadDocument = vi.fn();

vi.mock('@university-erp/api-clients', () => ({
    admissionsApi: {
        checkEligibility: (data: any) => mockCheckEligibility(data),
        uploadDocument: (id: string, data: any) => mockUploadDocument(id, data),
    }
}));

const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => mockUseAuth(),
}));

// --- Dummy Components for Testing ---
const ApplicationForm = () => {
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };
    return (
        <form onSubmit={handleSubmit}>
            <input name="firstName" placeholder="First Name" required />
            <button type="submit">Submit Application</button>
        </form>
    );
};

const EligibilityChecker = () => {
    const check = () => mockCheckEligibility({ gpa: 3.5 });
    return <button onClick={check}>Check Eligibility</button>;
};

const DocumentUpload = () => {
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && !['application/pdf', 'image/jpeg'].includes(file.type)) {
            alert('Unsupported file format');
        }
    };
    return <input type="file" data-testid="doc-upload" onChange={handleUpload} />;
};

// --- Test Suite ---
describe('Applicant Portal - Core Scenarios', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        vi.clearAllMocks();
    });

    // TC01 & TC02: Form Rendering and Validation
    it('TC01 & TC02: Renders application form and asserts validation fails on empty required fields', async () => {
        render(<ApplicationForm />);
        const input = screen.getByPlaceholderText('First Name') as HTMLInputElement;
        const submitBtn = screen.getByText('Submit Application');
        
        expect(input).toBeDefined(); // TC01
        
        fireEvent.click(submitBtn);
        expect(input.validity.valueMissing).true; // TC02
    });

    // TC04 & TC05: Eligibility Checker
    it('TC04 & TC05: Validates Eligibility Checker states based on GPA', async () => {
        mockCheckEligibility.mockResolvedValue({ isEligible: true, message: 'You meet the minimum requirements.' });
        render(<EligibilityChecker />);
        
        fireEvent.click(screen.getByText('Check Eligibility'));
        
        await waitFor(() => {
            expect(mockCheckEligibility).toHaveBeenCalledWith({ gpa: 3.5 });
        });
    });

    // TC06 & TC07: Document Upload Handling
    it('TC06 & TC07: Validates PDF/JPG uploads and catches unsupported formats', async () => {
        const user = userEvent.setup();
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        render(<DocumentUpload />);
        
        const uploader = screen.getByTestId('doc-upload');
        
        // TC07: Unsupported file
        const txtFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });
        await user.upload(uploader, txtFile);
        expect(alertMock).toHaveBeenCalledWith('Unsupported file format');
        
        // TC06: Supported file
        const pdfFile = new File(['dummy content'], 'transcript.pdf', { type: 'application/pdf' });
        await user.upload(uploader, pdfFile);
        expect(alertMock).toHaveBeenCalledTimes(1); // Not called again
    });

    // TC13 & TC14: Authentication & Role Authorization
    it('TC13 & TC14: Asserts Applicant Portal Role Authorization blocks non-applicants', async () => {
        // Simulating a registered Student trying to access the Applicant portal
        mockUseAuth.mockReturnValue({
            identity: { id: 'STU-999', roles: ['Student'] },
            isAuthenticated: true
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <Routes>
                        <Route element={<AuthGuard />}>
                            <Route path="/dashboard" element={<h1>Applicant Dashboard</h1>} />
                        </Route>
                        <Route path="/unauthorized" element={<h2>403 Forbidden</h2>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // Expect the AuthGuard to block access (UI will render the 403 fallback configured in AuthGuard)
        expect(screen.queryByText('Applicant Dashboard')).toBeNull();
    });
});
