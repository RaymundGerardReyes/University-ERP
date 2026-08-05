import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchMyStudents } from './Students.api';

export const useFacultyStudents = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['facultyStudents', user?.id],
        queryFn: () => fetchMyStudents(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 10, // Cache roster for 10 minutes
    });
};