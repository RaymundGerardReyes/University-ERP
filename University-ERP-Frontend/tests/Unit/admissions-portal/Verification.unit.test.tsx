// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: Verification
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/Verification/Verification.api.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Verification/Verification.hooks.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Verification/Verification.page.tsx
// University-ERP-Frontend/apps/admissions-portal/src/features/Verification/Verification.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { DocumentVerificationPage } from '../../../../apps/faculty-portal/src/features/SecretaryWorkspace/DocumentVerification.page';

const mockVerifyDocuments = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { verifyDocuments: (id: string) => mockVerifyDocuments(id) }
}));

describe('Admissions Portal - Document Verification', () => {
  const queryClient = new QueryClient();

  it('TC19: Verification_Should_Call_VerifyDocumentsCommand_And_Transition_To_InterviewPending', async () => {
    const user = userEvent.setup();
    mockVerifyDocuments.mockResolvedValue(true);
    
    render(
      <QueryClientProvider client={queryClient}>
        <DocumentVerificationPage applicationId="APP-101" currentStatus="Submitted" />
      </QueryClientProvider>
    );

    await user.click(screen.getByRole('button', { name: /Approve Documents/i }));

    await waitFor(() => {
      expect(mockVerifyDocuments).toHaveBeenCalledWith('APP-101');
      expect(screen.getByText(/Transitioned to InterviewPending/i)).toBeDefined();
    });
  });

  it('TC20: Verification_Should_Display_Validation_Error_If_Rejection_Reason_Is_Empty', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <DocumentVerificationPage applicationId="APP-101" currentStatus="Submitted" />
      </QueryClientProvider>
    );

    await user.click(screen.getByRole('button', { name: /Reject Documents/i }));

    expect(screen.getByText(/Rejection reason is required/i)).toBeDefined();
    expect(mockVerifyDocuments).not.toHaveBeenCalled();
  });
});
