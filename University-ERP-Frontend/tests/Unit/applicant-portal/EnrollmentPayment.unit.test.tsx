// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: EnrollmentPayment
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { EnrollmentPaymentPage } from '../../../../apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.page';

const mockCreateSession = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  financePaymentSessionApi: { createSession: (...args: any) => mockCreateSession(...args) }
}));

describe('EnrollmentPayment Feature', () => {
  const queryClient = new QueryClient();

  it('TC14: EnrollmentPayment_Should_Render_Payment_Gateway_When_Status_Is_Endorsed_For_Enrollment', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EnrollmentPaymentPage applicationStatus="Endorsed_For_Enrollment" />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Secure Payment Gateway/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Pay Enrollment Fee/i })).toBeDefined();
  });

  it('TC15: EnrollmentPayment_Should_Display_Success_And_Student_ID_Upon_Payment_Verification', async () => {
    mockCreateSession.mockResolvedValue({ status: 'Paid', generatedStudentId: 'STU-2026-9999' });
    render(
      <QueryClientProvider client={queryClient}>
        <EnrollmentPaymentPage applicationStatus="Endorsed_For_Enrollment" />
      </QueryClientProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Pay Enrollment Fee/i }));

    await waitFor(() => {
      expect(screen.getByText(/Payment Successful/i)).toBeDefined();
      expect(screen.getByText(/STU-2026-9999/i)).toBeDefined();
    });
  });
});
