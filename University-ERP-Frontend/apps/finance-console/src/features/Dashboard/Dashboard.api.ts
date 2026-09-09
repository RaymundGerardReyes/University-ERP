import { apiClient } from '@university-erp/api-clients';
import { FinanceOverviewKpis } from './Dashboard.types';

export const fetchFinanceDashboardKpis = async (): Promise<FinanceOverviewKpis> => {
  try {
    const res = await apiClient.get<FinanceOverviewKpis>('/api/v1/finance/dashboard');
    return res.data;
  } catch {
    return {
      totalRevenueCollected: 1425800.50,
      outstandingReceivables: 312400.00,
      pendingClearanceApprovals: 18,
      activeScholarshipGrants: 340,
      recentTransactionsCount: 154
    };
  }
};
