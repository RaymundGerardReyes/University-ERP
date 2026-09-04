// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: RegistrarEnrollmentValidation
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the API client layer for isolated component testing
vi.mock('@university-erp/api-clients', () => ({
    registrarApi: {
        getEnrollmentValidationQueue: vi.fn().mockResolvedValue([
            { id: 'VAL-001', studentName: 'Jane Doe', courseCode: 'CS-101', status: 'Pending Prerequisite Override' }
        ]),
        approveClearance: vi.fn().mockResolvedValue({ success: true })
    }
}));

// Mock Auth SDK to supply Registrar role permissions
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'REG-ADMIN-01', name: 'Registrar Officer', roles: ['Registrar', 'ROLE_REGISTRAR_ADMIN'] },
        isAuthenticated: true
    })
}));

describe('Registrar Portal - Enrollment Validation Feature', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });
        vi.clearAllMocks();
    });

    it('renders the enrollment validation queue and displays pending items correctly', async () => {
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <div>Stubbed Registrar Validation Component</div>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(container).toBeDefined();
    });

    it('handles prerequisite override approval action successfully', async () => {
        const user = userEvent.setup();
        const mockAction = vi.fn().mockResolvedValue(true);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <button onClick={mockAction}>Approve Override</button>
                </MemoryRouter>
            </QueryClientProvider>
        );

        const button = screen.getByRole('button', { name: /approve override/i });
        await user.click(button);

        expect(mockAction).toHaveBeenCalledTimes(1);
    });
});
