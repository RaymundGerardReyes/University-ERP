// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: AdmissionsDecision
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/AdmissionsDecision/AdmissionsDecision.api.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/AdmissionsDecision/AdmissionsDecision.hooks.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/AdmissionsDecision/AdmissionsDecision.page.tsx
// University-ERP-Frontend/apps/admissions-portal/src/features/AdmissionsDecision/AdmissionsDecision.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { EndorsementPage } from '../../../apps/faculty-portal/src/features/DeanWorkspace/Endorsement.page';

const mockApproveApplication = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { approveApplication: (data: any) => mockApproveApplication(data) }
}));

describe('Admissions Portal - Dean Endorsement & Approval', () => {
  const queryClient = new QueryClient();

  it('TC26: DeanEndorsement_Should_Enable_Endorse_Button_Only_If_Status_Is_Recommended', () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <EndorsementPage status="UnderAcademicEvaluation" />
      </QueryClientProvider>
    );
    
    expect(screen.getByRole('button', { name: /Approve/i })).toBeDisabled();

    rerender(
      <QueryClientProvider client={queryClient}>
        <EndorsementPage status="Recommended" />
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: /Approve/i })).not.toBeDisabled();
  });

  it('TC27: ChairpersonEvaluation_Should_Call_ApproveApplicationCommand_And_Transition_To_Accepted', async () => {
    const user = userEvent.setup();
    mockApproveApplication.mockResolvedValue(true);

    render(
      <QueryClientProvider client={queryClient}>
        <EndorsementPage applicationId="APP-300" status="Recommended" />
      </QueryClientProvider>
    );

    await user.click(screen.getByRole('button', { name: /Approve/i }));

    await waitFor(() => {
      expect(mockApproveApplication).toHaveBeenCalledWith(expect.objectContaining({ action: 'Approve' }));
      expect(screen.getByText(/Application Status: Accepted/i)).toBeDefined();
    });
  });
});
