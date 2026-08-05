import { useQuery } from '@tanstack/react-query';
import { fetchSystemRoles } from './RoleAdministration.api';

export const useSystemRoles = () => {
  return useQuery({
    queryKey: ['systemRoles'],
    queryFn: fetchSystemRoles,
  });
};