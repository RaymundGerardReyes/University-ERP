import { useQuery } from '@tanstack/react-query';
import { fetchGlobalSettings } from './GlobalSettings.api';

export const useGlobalSettings = () => {
  return useQuery({
    queryKey: ['platform', 'settings'],
    queryFn: fetchGlobalSettings,
    staleTime: 60000
  });
};
