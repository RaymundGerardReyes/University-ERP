import { useQuery } from '@tanstack/react-query';
import { fetchSystemHealth } from './IntegrationManagement.api';

export const useSystemHealth = () => {
    return useQuery({
        queryKey: ['systemHealth'],
        queryFn: fetchSystemHealth,
    });
};