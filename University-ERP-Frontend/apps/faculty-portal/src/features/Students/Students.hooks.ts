import { useQuery } from '@tanstack/react-query';
import { facultyStudentsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useFacultyStudents = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['facultyStudents', identity?.id],
        queryFn: () => facultyStudentsApi.getMyStudents(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};