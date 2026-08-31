// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: EnrollmentHandoff
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/EnrollmentHandoff/EnrollmentHandoff.api.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/EnrollmentHandoff/EnrollmentHandoff.hooks.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/EnrollmentHandoff/EnrollmentHandoff.page.tsx
// University-ERP-Frontend/apps/admissions-portal/src/features/EnrollmentHandoff/EnrollmentHandoff.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { RegistrarEnrollmentView } from '../../../../apps/admin-portal/src/features/AdmissionsProcessing/components/RegistrarEnrollmentView';

const mockActivateEnrollment = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { activateEnrollment: (id: string) => mockActivateEnrollment(id) }
}));

describe('Admissions Processing - Registrar Enrollment Handoff', () => {
  const queryClient = new QueryClient();

  it('TC28: RegistrarEnrollment_Should_List_Candidates_Endorsed_For_Enrollment', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegistrarEnrollmentView candidates={[{ id: 'APP-400', status: 'Endorsed_For_Enrollment' }]} />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('APP-400')).toBeDefined();
    expect(screen.getByRole('button', { name: /Activate Enrollment/i })).toBeDefined();
  });

  it('TC29: RegistrarEnrollment_Should_Call_ActivateEnrollmentCommand_And_Generate_StudentId', async () => {
    const user = userEvent.setup();
    mockActivateEnrollment.mockResolvedValue({ studentId: 'STU-2026-0001' });

    render(
      <QueryClientProvider client={queryClient}>
        <RegistrarEnrollmentView candidates={[{ id: 'APP-400', status: 'Endorsed_For_Enrollment' }]} />
      </QueryClientProvider>
    );

    await user.click(screen.getByRole('button', { name: /Activate Enrollment/i }));

    await waitFor(() => {
      expect(mockActivateEnrollment).toHaveBeenCalledWith('APP-400');
      expect(screen.getByText(/Generated ID: STU-2026-0001/i)).toBeDefined();
    });
  });

  it('TC30: RegistrarEnrollment_Should_Display_Error_Toast_If_Activation_Fails_Due_To_InvalidState', async () => {
    const user = userEvent.setup();
    mockActivateEnrollment.mockRejectedValue(new Error('Admissions.InvalidState'));

    render(
      <QueryClientProvider client={queryClient}>
        <RegistrarEnrollmentView candidates={[{ id: 'APP-401', status: 'Accepted' }]} />
      </QueryClientProvider>
    );

    await user.click(screen.getByRole('button', { name: /Activate Enrollment/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to activate: Application must be endorsed by the Dean/i)).toBeDefined();
    });
  });
});
