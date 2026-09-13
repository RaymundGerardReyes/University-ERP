import { useQuery } from '@tanstack/react-query';
import { financialReportsApi } from './FinancialReports.api';

export const REPORTS_QUERY_KEY = ['finance', 'reports'];
export const BREAKDOWN_QUERY_KEY = ['finance', 'reports', 'breakdown'];

export function useFinancialReports() {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () => financialReportsApi.getAllReports(),
    staleTime: 0,
    refetchOnWindowFocus: true
  });
}

export function useRevenueBreakdown(period?: string) {
  return useQuery({
    queryKey: [...BREAKDOWN_QUERY_KEY, period || 'latest'],
    queryFn: () => financialReportsApi.getRevenueBreakdown(period),
    staleTime: 0,
    refetchOnWindowFocus: true
  });
}
