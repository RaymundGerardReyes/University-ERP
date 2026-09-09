import { useQuery } from '@tanstack/react-query';
import { fetchCampusTenants } from './TenantManagement.api';

export const useCampusTenants = () => {
  return useQuery({
    queryKey: ['platform', 'tenants'],
    queryFn: fetchCampusTenants,
    staleTime: 60000
  });
};
