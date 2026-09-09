import { useQuery } from '@tanstack/react-query';
import { fetchPolicies } from './Policies.api';

export const usePolicies = () => {
  return useQuery({
    queryKey: ['governance', 'policies'],
    queryFn: fetchPolicies,
    staleTime: 60000
  });
};
