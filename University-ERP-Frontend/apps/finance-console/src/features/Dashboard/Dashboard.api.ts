import { apiClient } from '@university-erp/api-clients';
import { FinanceOverviewKpis, CashierLedgerEntry } from './Dashboard.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const dashboardApi = {
  getDashboardKpis: async (): Promise<FinanceOverviewKpis> => {
    const res = await apiClient.get<FinanceOverviewKpis>('/finance/dashboard');
    return res.data;
  },

  getDailyCashierLedger: async (date?: string): Promise<CashierLedgerEntry[]> => {
    const res = await apiClient.get<CashierLedgerEntry[]>('/finance/cashier-ledger', { params: { date } });
    return toSafeArray<CashierLedgerEntry>(res.data);
  },

  disburseCashierLedger: async (terminalId: string): Promise<{ success: boolean; batchRef: string }> => {
    const res = await apiClient.post<{ success: boolean; batchRef: string }>('/finance/cashier-ledger/disburse', { terminalId });
    return res.data;
  },
};

export const fetchFinanceDashboardKpis = dashboardApi.getDashboardKpis;
