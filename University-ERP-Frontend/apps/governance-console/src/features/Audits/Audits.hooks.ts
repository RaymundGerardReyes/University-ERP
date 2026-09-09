import { useQuery } from '@tanstack/react-query';
import { fetchAuditList } from './Audits.api';

export const useAudits = () => {
  return useQuery({
    queryKey: ['governance', 'audits'],
    queryFn: fetchAuditList,
    staleTime: 60000
  });
};
