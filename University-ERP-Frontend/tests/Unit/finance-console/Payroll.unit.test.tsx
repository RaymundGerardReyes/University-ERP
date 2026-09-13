import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PayrollPage } from '../../../apps/finance-console/src/features/Payroll/Payroll.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['Finance'] } })
}));

describe("Payroll - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders payroll management page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><PayrollPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("calls /finance/payroll/disburse when disbursePayroll is invoked", async () => {
    const { apiClient } = await import('@university-erp/api-clients');
    const { payrollApi } = await import('../../../apps/finance-console/src/features/Payroll/Payroll.api');

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: {
        success: true,
        transactionId: "TX-TRF-PAYROLL-1234"
      }
    } as any);

    const payload = {
      employeeId: "FAC-ENG-001",
      destinationAccount: "4859220011112222",
      amount: 7100,
      payPeriod: "Aug 2026"
    };

    const result = await payrollApi.disbursePayroll(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/finance/payroll/disburse', payload);
    expect(result.success).toBe(true);
    expect(result.transactionId).toBe("TX-TRF-PAYROLL-1234");
  });

  it("calls /payroll/records when getPayrollHistory is invoked", async () => {
    const { apiClient } = await import('@university-erp/api-clients');
    const { payrollApi } = await import('../../../apps/finance-console/src/features/Payroll/Payroll.api');

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: [
        {
          payrollId: 'PAY-2026-101',
          employeeId: 'FAC-ENG-001',
          employeeName: 'Dr. Alan Turing',
          department: 'Computer Science',
          payPeriod: 'Aug 2026',
          basicSalary: 7500,
          allowances: 800,
          deductions: 1200,
          netPay: 7100,
          status: 'DISBURSED'
        }
      ]
    } as any);

    const records = await payrollApi.getPayrollHistory("Aug 2026");

    expect(apiClient.get).toHaveBeenCalledWith('/payroll/records', {
      params: { payPeriod: "Aug 2026" }
    });
    expect(records).toHaveLength(1);
    expect(records[0].payrollId).toBe('PAY-2026-101');
  });
});
