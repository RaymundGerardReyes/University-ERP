import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchFacultyDocuments } from './Documents.api';

export const useFacultyDocuments = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['facultyDocuments', user?.id],
        queryFn: () => fetchFacultyDocuments(user!.id),
        enabled: !!user?.id,
    });
};