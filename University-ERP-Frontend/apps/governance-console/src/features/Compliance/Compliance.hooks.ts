import { useQuery } from '@tanstack/react-query';
import { fetchComplianceRequirements } from './Compliance.api';

export const useComplianceRecords = () => {
  return useQuery({
    queryKey: ['governance', 'compliance'],
    queryFn: fetchComplianceRequirements,
    staleTime: 60000
  });
};
