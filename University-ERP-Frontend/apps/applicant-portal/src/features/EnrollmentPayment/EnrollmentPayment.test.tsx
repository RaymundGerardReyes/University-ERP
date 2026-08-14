import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { EnrollmentPaymentPage } from './EnrollmentPayment.page';

// 1. Mock the Auth SDK
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-applicant' },
        user: { id: 'test-applicant' },
        isAuthenticated: true
    })
}));

// 2. Mock the API Clients to prevent real network requests
vi.mock('@university-erp/api-clients', () => ({
    financeApi: {
        getInvoices: vi.fn().mockResolvedValue([])
    },
    financeBillingApi: {
        generateCashToken: vi.fn().mockResolvedValue('test-token')
    }
}));

describe('EnrollmentPaymentPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnrollmentPaymentPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});