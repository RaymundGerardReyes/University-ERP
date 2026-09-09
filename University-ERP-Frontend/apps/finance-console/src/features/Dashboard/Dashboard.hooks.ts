import { useQuery } from '@tanstack/react-query';
import { fetchFinanceDashboardKpis } from './Dashboard.api';

export const useFinanceDashboardKpis = () => {
  return useQuery({
    queryKey: ['finance', 'dashboard', 'kpis'],
    queryFn: fetchFinanceDashboardKpis,
    staleTime: 60000
  });
};
