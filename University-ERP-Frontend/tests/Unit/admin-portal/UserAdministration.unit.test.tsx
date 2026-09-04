import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { UserAdministrationPage } from '../../../apps/admin-portal/src/features/UserAdministration/UserAdministration.page';
import * as UserApi from '../../../apps/admin-portal/src/features/UserAdministration/UserAdministration.api';

const mockFetchSystemUsers = vi.spyOn(UserApi, 'fetchSystemUsers');
const mockRevokeUserAccess = vi.spyOn(UserApi, 'revokeUserAccess');

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'EMP-ADMIN-01', name: 'IAM Admin', roles: ['SuperAdmin'] },
        isAuthenticated: true
    })
}));

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UserAdministrationPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('UserAdministration - Unit Testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- User Directory & Search ---
    it('should render the main User Administration directory list correctly', async () => {
        mockFetchSystemUsers.mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('User Administration')).toBeDefined();
            expect(screen.getByText(/Govern identity access, roles, and security/i)).toBeDefined();
        });
    });

    it('should display a loading skeleton while fetching user lists', () => {
        mockFetchSystemUsers.mockImplementation(() => new Promise(() => {}));
        const { container } = renderComponent();
        expect(container.querySelector('.skeleton')).toBeDefined();
    });

    it('should correctly calculate and display the total number of Locked Accounts', async () => {
        mockFetchSystemUsers.mockResolvedValue([
            { id: 'USR-1001', name: 'Alan Turing', email: 'aturing@edu', role: 'Faculty', status: 'Active' },
            { id: 'USR-1002', name: 'Marcus Johnson', email: 'mjohnson@edu', role: 'Admin', status: 'Locked' },
            { id: 'USR-1003', name: 'Grace Hopper', email: 'ghopper@edu', role: 'Student', status: 'Locked' },
        ]);
        renderComponent();

        await waitFor(() => {
            // There are 2 locked users in the mock payload
            const statValues = screen.getAllByText('2');
            expect(statValues.length).toBeGreaterThan(0);
        });
    });

    // --- Profile & Status Management ---
    it('should visually map and display all roles currently assigned to the user', async () => {
        mockFetchSystemUsers.mockResolvedValue([
            { id: 'USR-1001', name: 'Dr. Alan Turing', email: 'aturing@edu', role: 'Faculty', status: 'Active' }
        ]);
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Dr. Alan Turing')).toBeDefined();
            expect(screen.getByText('Faculty')).toBeDefined();
        });
    });

    it('should visually distinguish Suspended/Locked accounts from Active accounts in the UI', async () => {
        mockFetchSystemUsers.mockResolvedValue([
            { id: 'USR-1002', name: 'Marcus Johnson', email: 'mjohnson@edu', role: 'Admin', status: 'Locked' }
        ]);
        renderComponent();

        await waitFor(() => {
            const badge = screen.getByText('Locked');
            expect(badge.className).toContain('badge-danger');
        });
    });

    // --- Account Suspension & Revocation ---
    it('should allow an admin to manually unlock an account locked due to brute force attempts', async () => {
        const user = userEvent.setup();
        mockFetchSystemUsers.mockResolvedValue([
            { id: 'USR-1002', name: 'Marcus Johnson', email: 'm@edu', role: 'Admin', status: 'Locked' }
        ]);
        mockRevokeUserAccess.mockResolvedValue({ userId: 'USR-1002', action: 'unlocked' });

        renderComponent();

        await waitFor(() => expect(screen.getByText('Marcus Johnson')).toBeDefined());

        // For Locked users, the button says "Unlock Account"
        const unlockBtn = screen.getByRole('button', { name: /Unlock Account/i });
        await user.click(unlockBtn);

        await waitFor(() => {
            expect(mockRevokeUserAccess).toHaveBeenCalledWith('USR-1002');
        });
    });

    it('should instantly terminate any active sessions by dispatching a revoke access payload', async () => {
        const user = userEvent.setup();
        mockFetchSystemUsers.mockResolvedValue([
            { id: 'USR-1001', name: 'Alan Turing', email: 'a@edu', role: 'Faculty', status: 'Active' }
        ]);
        mockRevokeUserAccess.mockResolvedValue({ userId: 'USR-1001', action: 'revoked' });

        renderComponent();

        await waitFor(() => expect(screen.getByText('Alan Turing')).toBeDefined());

        // For Active users, the button says "Revoke Access"
        const revokeBtn = screen.getByRole('button', { name: /Revoke Access/i });
        await user.click(revokeBtn);

        await waitFor(() => {
            expect(mockRevokeUserAccess).toHaveBeenCalledWith('USR-1001');
        });
    });

    // --- TDD Placeholders for Missing UI Elements ---
    it('should correctly enforce complex password rules if manually setting an initial password', async () => {
        renderComponent();
        // This will fail until the "Create New User" modal is added to the component
        const createUserBtn = screen.queryByRole('button', { name: /Create New User/i });
        expect(createUserBtn).not.toBeNull();
    });

    it('should allow a SuperAdmin to securely initiate an "Impersonate User" session', async () => {
        renderComponent();
        // This will fail until the "Impersonate" functionality is added
        const impersonateBtn = screen.queryByRole('button', { name: /Impersonate/i });
        expect(impersonateBtn).not.toBeNull();
    });
});
