import { useQuery } from '@tanstack/react-query';
import { fetchSecurityEvents } from './SecurityAudits.api';

export const useSecurityAudits = () => {
  return useQuery({
    queryKey: ['platform', 'security', 'events'],
    queryFn: fetchSecurityEvents,
    staleTime: 15000
  });
};
