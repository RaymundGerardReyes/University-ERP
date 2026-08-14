import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AdmissionAssessmentPage } from './AdmissionAssessment.page';

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-finance' },
        user: { id: 'test-finance' },
        isAuthenticated: true
    })
}));

describe('AdmissionAssessmentPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdmissionAssessmentPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});