import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from './Dashboard.api';
import { FinanceOverviewKpis, CashierLedgerEntry } from './Dashboard.types';

import { toSafeArray } from '../../utils/arrayUtils';

export const useFinanceDashboardKpis = () => {
  return useQuery<FinanceOverviewKpis, Error>({
    queryKey: ['finance', 'dashboard', 'kpis'],
    queryFn: dashboardApi.getDashboardKpis,
  });
};

export const useDailyCashierLedger = (date?: string) => {
  const queryClient = useQueryClient();

  const ledgerQuery = useQuery<CashierLedgerEntry[], Error>({
    queryKey: ['finance', 'cashier-ledger', date],
    queryFn: () => dashboardApi.getDailyCashierLedger(date),
  });

  const disburseMutation = useMutation({
    mutationFn: (terminalId: string) => dashboardApi.disburseCashierLedger(terminalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'cashier-ledger'] });
      queryClient.invalidateQueries({ queryKey: ['finance', 'dashboard'] });
    },
  });

  return {
    ledger: toSafeArray<CashierLedgerEntry>(ledgerQuery.data),
    isLoading: ledgerQuery.isLoading,
    disburseLedger: disburseMutation.mutateAsync,
    isDisbursing: disburseMutation.isPending,
  };
};
