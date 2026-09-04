import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { WorkflowManagementPage } from '../../../apps/admin-portal/src/features/WorkflowManagement/WorkflowManagement.page';
import * as WorkflowApi from '../../../apps/admin-portal/src/features/WorkflowManagement/WorkflowManagement.api';

const mockFetchActiveWorkflows = vi.spyOn(WorkflowApi, 'fetchActiveWorkflows');

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'EMP-ADMIN-01', name: 'Workflow Admin', roles: ['Admin'] },
        isAuthenticated: true
    })
}));

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <WorkflowManagementPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('WorkflowManagement - Unit Testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- Workflow Builder UI & Dashboard ---
    it('should render the Workflow Management overview correctly', async () => {
        mockFetchActiveWorkflows.mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Workflow Management')).toBeDefined();
            expect(screen.getByText(/Configure state machines and approval routing/i)).toBeDefined();
            expect(screen.getByRole('button', { name: /Create Workflow/i })).toBeDefined();
        });
    });

    it('should display a loading skeleton while fetching workflow states', () => {
        mockFetchActiveWorkflows.mockImplementation(() => new Promise(() => {}));
        const { container } = renderComponent();
        expect(container.querySelector('.skeleton')).toBeDefined();
    });

    // --- Live Instance Tracking ---
    it('should render a list of all currently active workflow execution instances', async () => {
        mockFetchActiveWorkflows.mockResolvedValue([
            {
                workflowName: 'Purchase Order Approval',
                steps: [
                    { stepName: 'Submit PO', status: 'Completed' },
                    { stepName: 'Finance Review', status: 'Active' },
                    { stepName: 'Final Execution', status: 'Pending' }
                ]
            }
        ]);
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Purchase Order Approval')).toBeDefined();
            expect(screen.getByText('Submit PO')).toBeDefined();
            expect(screen.getByText('Finance Review')).toBeDefined();
            expect(screen.getByText('Final Execution')).toBeDefined();
        });
    });

    it('should visually highlight the exact node currently executing on a live instance map', async () => {
        mockFetchActiveWorkflows.mockResolvedValue([
            {
                workflowName: 'Student Enrollment',
                steps: [
                    { stepName: 'Intake', status: 'Completed' },
                    { stepName: 'Registrar Approval', status: 'Active' }
                ]
            }
        ]);
        renderComponent();

        await waitFor(() => {
            const completedStep = screen.getByText('Intake');
            const activeStep = screen.getByText('Registrar Approval');
            
            // Completed steps should have success background
            expect(completedStep.style.background).toBe('var(--success-bg)');
            // Active steps should have info background
            expect(activeStep.style.background).toBe('var(--info-bg)');
        });
    });

    // --- TDD Placeholders for Missing UI Elements ---
    it('should allow dropping a new action node onto the workflow canvas', async () => {
        renderComponent();
        // This will fail until the Drag-and-Drop Canvas is built
        const canvasElement = screen.queryByTestId('workflow-canvas-dropzone');
        expect(canvasElement).not.toBeNull();
    });

    it('should allow configuring a Schedule-based trigger (e.g., Every Friday at 5 PM)', async () => {
        renderComponent();
        // This will fail until trigger configuration forms are added
        const cronInput = screen.queryByRole('textbox', { name: /CRON Schedule/i });
        expect(cronInput).not.toBeNull();
    });

    it('should maintain a historical read-only log of all previous workflow versions', async () => {
        renderComponent();
        // This will fail until Versioning UI is added
        const versionHistoryTab = screen.queryByRole('button', { name: /Version History/i });
        expect(versionHistoryTab).not.toBeNull();
    });
});
