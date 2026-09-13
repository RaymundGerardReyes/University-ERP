import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { FinancialReportsPage } from '../../../apps/finance-console/src/features/FinancialReports/FinancialReports.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['Finance'] } })
}));

describe("FinancialReports - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders financial reports page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><FinancialReportsPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("calls /finance/reports/statements when getBankStatements is invoked", async () => {
    const { apiClient } = await import('@university-erp/api-clients');
    const { financialReportsApi } = await import('../../../apps/finance-console/src/features/FinancialReports/FinancialReports.api');
    
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: {
        accountNumber: "4859220013371001",
        statements: [{ id: "TX-01", amount: 5000 }]
      }
    } as any);

    const result = await financialReportsApi.getBankStatements();

    expect(apiClient.get).toHaveBeenCalledWith('/finance/reports/statements');
    expect(result.accountNumber).toBe("4859220013371001");
    expect(result.statements).toHaveLength(1);
  });

  it("calls /finance/reports when getAllReports is invoked", async () => {
    const { apiClient } = await import('@university-erp/api-clients');
    const { financialReportsApi } = await import('../../../apps/finance-console/src/features/FinancialReports/FinancialReports.api');

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: [
        {
          reportId: "REP-01",
          reportName: "Q3 Realization",
          period: "2026-Q3",
          generatedDate: "2026-09-01",
          totalRevenue: 250000,
          totalExpenditure: 150000,
          netMargin: 100000,
          status: "Audited"
        }
      ]
    } as any);

    const reports = await financialReportsApi.getAllReports();

    expect(apiClient.get).toHaveBeenCalledWith('/finance/reports');
    expect(reports).toHaveLength(1);
    expect(reports[0].reportId).toBe("REP-01");
  });
});
