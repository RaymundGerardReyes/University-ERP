import { useQuery } from '@tanstack/react-query';
import { fetchSystemLogs } from './SystemLogs.api';

export const useSystemLogs = () => {
  return useQuery({
    queryKey: ['platform', 'logs'],
    queryFn: fetchSystemLogs,
    staleTime: 10000
  });
};
