import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useFacultyDocuments = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['facultyDocuments', identity?.id],
        queryFn: () => documentsApi.getDocuments(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};