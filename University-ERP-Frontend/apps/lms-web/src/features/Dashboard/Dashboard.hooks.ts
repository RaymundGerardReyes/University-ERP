import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './Dashboard.api';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['lmsDashboard'],
    queryFn: () => dashboardApi.getOverview()
  });
}
