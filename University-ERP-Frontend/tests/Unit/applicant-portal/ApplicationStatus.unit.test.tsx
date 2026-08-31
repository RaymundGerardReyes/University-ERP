// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: ApplicationStatus
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationStatusPage } from '../../../../apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.page';

const mockGetApplicationStatus = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { getApplicationStatus: () => mockGetApplicationStatus() }
}));

describe('ApplicationStatus Feature', () => {
  const queryClient = new QueryClient();

  it('TC11: ApplicationStatus_Should_Render_Loading_Skeleton_While_Fetching', () => {
    mockGetApplicationStatus.mockImplementation(() => new Promise(() => {}));
    render(
      <QueryClientProvider client={queryClient}>
        <ApplicationStatusPage />
      </QueryClientProvider>
    );
    expect(screen.getByTestId('status-loading-skeleton')).toBeDefined();
  });

  it('TC12: ApplicationStatus_Should_Display_Stepper_Accurately_Reflecting_Backend_Status', async () => {
    mockGetApplicationStatus.mockResolvedValue([{ status: 'UnderAcademicEvaluation' }]);
    render(
      <QueryClientProvider client={queryClient}>
        <ApplicationStatusPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const activeStep = screen.getByTestId('stepper-active-step');
      expect(activeStep.textContent).toContain('Academic Evaluation');
    });
  });
});
