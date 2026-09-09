import { useQuery } from '@tanstack/react-query';
import { fetchRiskRegister } from './RiskManagement.api';

export const useRiskRegister = () => {
  return useQuery({
    queryKey: ['governance', 'risks'],
    queryFn: fetchRiskRegister,
    staleTime: 60000
  });
};
