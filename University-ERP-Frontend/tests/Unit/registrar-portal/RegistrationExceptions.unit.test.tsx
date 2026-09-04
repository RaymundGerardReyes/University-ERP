// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: RegistrationExceptions
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RegistrationExceptionsPage } from '../../../apps/registrar-portal/src/features/EnrollmentDivision/RegistrationExceptions.page';

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-admin' },
        user: { id: 'test-admin' },
        isAuthenticated: true
    })
}));

describe('RegistrationExceptionsPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RegistrationExceptionsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});
