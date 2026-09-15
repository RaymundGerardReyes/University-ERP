// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: EnrollmentPayment / PaymentReturn

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentReturnPage } from '../../../apps/applicant-portal/src/features/EnrollmentPayment/PaymentReturn.page';
import { financePaymentSessionApi } from '@university-erp/api-clients';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'APP-101', name: 'Jordan Applicant', email: 'jordan@university.edu' },
    identity: { id: 'APP-101', name: 'Jordan Applicant', email: 'jordan@university.edu' },
    isAuthenticated: true,
  }),
}));

vi.mock('@university-erp/api-clients', () => ({
  financePaymentSessionApi: {
    validateSession: vi.fn(),
  },
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("PaymentReturn Feature", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = (search: string = "?sessionId=SESS-9988&type=enrollment") => render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/payment-return${search}`]}>
        <Routes>
          <Route path="/payment-return" element={<PaymentReturnPage />} />
          <Route path="/enrollment-payment" element={<div>Enrollment Payment Page</div>} />
          <Route path="/status" element={<div>Admission Status Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  it("TC01: PaymentReturn_Should_Render_Verified_Screen_For_Completed_Enrollment_Downpayment", async () => {
    vi.mocked(financePaymentSessionApi.validateSession).mockResolvedValue({
      sessionId: "SESS-9988",
      status: "Completed",
      amount: 1500,
      currency: "USD",
    });

    renderComponent("?sessionId=SESS-9988&type=enrollment");

    await waitFor(() => {
      expect(screen.getByText(/Enrollment Downpayment Verified/i)).toBeInTheDocument();
      expect(screen.getByText(/Enrollment Payment Successfully Settled/i)).toBeInTheDocument();
      expect(screen.getByText(/SESS-9988/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View Enrollment Status/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Return to Dashboard/i })).toBeInTheDocument();
    });
  });

  it("TC02: PaymentReturn_Should_Render_Verified_Screen_For_Settled_Application_Fee", async () => {
    vi.mocked(financePaymentSessionApi.validateSession).mockResolvedValue({
      sessionId: "SESS-7711",
      status: "Settled",
      amount: 50,
      currency: "USD",
    });

    renderComponent("?sessionId=SESS-7711&type=application-fee");

    await waitFor(() => {
      expect(screen.getByText(/Application Fee Verified/i)).toBeInTheDocument();
      expect(screen.getByText(/Application Fee Completed/i)).toBeInTheDocument();
      expect(screen.getByText(/SESS-7711/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View Admission Status/i })).toBeInTheDocument();
    });
  });

  it("TC03: PaymentReturn_Should_Render_Cancellation_Screen_When_Status_Is_Failed_Or_Cancelled", async () => {
    vi.mocked(financePaymentSessionApi.validateSession).mockResolvedValue({
      sessionId: "SESS-FAIL-01",
      status: "Cancelled",
      amount: 1500,
      currency: "USD",
    });

    renderComponent("?sessionId=SESS-FAIL-01&type=enrollment");

    await waitFor(() => {
      expect(screen.getByText(/Payment Incomplete or Cancelled/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Return and Try Again/i })).toBeInTheDocument();
    });
  });

  it("TC04: PaymentReturn_Should_Render_Pending_Screen_When_Awaiting_Async_Reconciliation", async () => {
    vi.mocked(financePaymentSessionApi.validateSession).mockResolvedValue({
      sessionId: "SESS-PEND-01",
      status: "Pending",
      amount: 1500,
      currency: "USD",
    });

    renderComponent("?sessionId=SESS-PEND-01&type=enrollment");

    await waitFor(() => {
      expect(screen.getByText(/Payment Processing/i)).toBeInTheDocument();
      expect(screen.getByText(/Awaiting Webhook Confirmation/i)).toBeInTheDocument();
    });
  });

  // Additional edge cases & verification invariants
  it.todo("should automatically trigger React Query cache invalidation for finance and admissions keys on verification");
  it.todo("should fallback to query parameter status hint if the gateway session API is temporarily unreachable");
  it.todo("should safely handle malformed or missing query parameters without throwing uncaught runtime errors");
});

