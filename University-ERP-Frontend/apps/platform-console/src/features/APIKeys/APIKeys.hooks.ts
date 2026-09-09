import { useQuery } from '@tanstack/react-query';
import { fetchApiKeys } from './APIKeys.api';

export const useApiKeys = () => {
  return useQuery({
    queryKey: ['platform', 'apiKeys'],
    queryFn: fetchApiKeys,
    staleTime: 60000
  });
};
