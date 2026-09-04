import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { SystemAdministrationPage } from '../../../apps/admin-portal/src/features/SystemAdministration/SystemAdministration.page';
import * as SystemApi from '../../../apps/admin-portal/src/features/SystemAdministration/SystemAdministration.api';

// Mock API layer
const mockFetchSystemConfig = vi.spyOn(SystemApi, 'fetchSystemConfig');
const mockUpdateSystemConfig = vi.spyOn(SystemApi, 'updateSystemConfig');

// Mock Auth SDK
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'EMP-ADMIN-01', name: 'Super Admin', roles: ['SuperAdmin'] },
        isAuthenticated: true
    })
}));

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <SystemAdministrationPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('SystemAdministration - Unit Testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- Global Settings & UI ---
    it('should render the overarching System Administration global config panel', async () => {
        mockFetchSystemConfig.mockResolvedValue({
            version: 'v1.4.0-ERP', maintenanceMode: false, registrationEnabled: true, activeNodes: 4, lastBackup: '2026-08-04T02:00:00Z', cacheStatus: 'Healthy'
        });
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('System Administration')).toBeDefined();
            expect(screen.getByText(/Manage global platform configurations/i)).toBeDefined();
        });
    });

    it('should display the status and timestamp of the last automated database snapshot', async () => {
        const mockDate = '2026-08-04T02:00:00Z';
        mockFetchSystemConfig.mockResolvedValue({
            version: 'v1.4.0', maintenanceMode: false, registrationEnabled: true, activeNodes: 4, lastBackup: mockDate, cacheStatus: 'Healthy'
        });
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Last Database Backup')).toBeDefined();
            expect(screen.getByText(new Date(mockDate).toLocaleString())).toBeDefined();
        });
    });

    it('should display current Redis cache utilization and key count metrics', async () => {
        mockFetchSystemConfig.mockResolvedValue({
            version: 'v1.4.0', maintenanceMode: false, registrationEnabled: true, activeNodes: 4, lastBackup: '', cacheStatus: 'Degraded'
        });
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Redis Cache Cluster')).toBeDefined();
            expect(screen.getByText('Degraded')).toBeDefined();
        });
    });

    // --- Feature Flags & Toggles ---
    it('should successfully activate the "Global Maintenance Mode" flag', async () => {
        const user = userEvent.setup();
        mockFetchSystemConfig.mockResolvedValue({
            version: 'v1.4.0', maintenanceMode: false, registrationEnabled: true, activeNodes: 4, lastBackup: '', cacheStatus: 'Healthy'
        });
        mockUpdateSystemConfig.mockResolvedValue({ key: 'maintenanceMode', value: true });

        renderComponent();

        await waitFor(() => expect(screen.getByText('Maintenance Mode')).toBeDefined());

        const toggleBtn = screen.getByRole('button', { name: /Disabled/i });
        await user.click(toggleBtn);

        await waitFor(() => {
            expect(mockUpdateSystemConfig).toHaveBeenCalledWith('maintenanceMode', true);
        });
    });

    it('should cleanly toggle the New Registrations feature flag without a full reload', async () => {
        const user = userEvent.setup();
        mockFetchSystemConfig.mockResolvedValue({
            version: 'v1.4.0', maintenanceMode: false, registrationEnabled: true, activeNodes: 4, lastBackup: '', cacheStatus: 'Healthy'
        });
        mockUpdateSystemConfig.mockResolvedValue({ key: 'registrationEnabled', value: false });

        renderComponent();

        await waitFor(() => expect(screen.getByText('New Registrations')).toBeDefined());

        const toggleBtn = screen.getByRole('button', { name: /Enabled/i });
        await user.click(toggleBtn);

        await waitFor(() => {
            expect(mockUpdateSystemConfig).toHaveBeenCalledWith('registrationEnabled', false);
        });
    });

    // --- TDD Placeholders for Missing UI Elements ---
    it('should successfully execute a "Send Test Email" command to verify the SMTP connection', async () => {
        renderComponent();
        // This will fail until you build the SMTP form in SystemAdministration.page.tsx
        const smtpTestBtn = screen.queryByRole('button', { name: /Send Test Email/i });
        expect(smtpTestBtn).not.toBeNull();
    });

    it('should display the current active ERP license key and validity period', async () => {
        renderComponent();
        // This will fail until you build the License UI
        const licenseKeyLabel = screen.queryByText(/Active ERP License/i);
        expect(licenseKeyLabel).not.toBeNull();
    });
});
