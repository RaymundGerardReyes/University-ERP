import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchFacultyInbox } from './Communication.api';

export const useFacultyInbox = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['facultyInbox', user?.id],
        queryFn: () => fetchFacultyInbox(user!.id),
        enabled: !!user?.id,
    });
};