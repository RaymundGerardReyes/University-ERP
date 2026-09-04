// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: RegistrarDashboard
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarDashboard

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RegistrarDashboardPage } from '../../../apps/registrar-portal/src/features/RegistrarDashboard/RegistrarDashboard.page';

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-registrar' },
        user: { id: 'test-registrar' },
        isAuthenticated: true
    })
}));

describe('RegistrarDashboardPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RegistrarDashboardPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});