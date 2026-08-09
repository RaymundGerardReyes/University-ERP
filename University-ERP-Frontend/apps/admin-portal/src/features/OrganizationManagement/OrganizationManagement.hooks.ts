import { useQuery } from '@tanstack/react-query';
import { fetchOrganizationHierarchy } from './OrganizationManagement.api';

export const useOrganizationHierarchy = () => {
    return useQuery({
        queryKey: ['orgHierarchy'],
        queryFn: fetchOrganizationHierarchy,
    });
};