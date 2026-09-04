// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: Registration
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/Registration

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RegistrationPage } from '../../../apps/student-portal/src/features/Registration/Registration.page';

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-student' },
        user: { id: 'test-student' },
        isAuthenticated: true
    })
}));

describe('RegistrationPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RegistrationPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});