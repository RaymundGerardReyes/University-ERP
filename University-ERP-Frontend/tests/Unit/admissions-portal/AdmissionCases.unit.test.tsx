// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: AdmissionCases
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/AdmissionCases

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AdmissionCasesPage } from '../../../apps/admissions-portal/src/features/AdmissionCases/AdmissionCases.page';

// Mock the authentication SDK to prevent context errors
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-admissions' },
        user: { id: 'test-admissions' },
        isAuthenticated: true
    })
}));

describe('AdmissionCasesPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdmissionCasesPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});