import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchMyCourses, logAttendance } from './Teaching.api';

export const useMyCourses = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['myCourses', user?.id],
        queryFn: () => fetchMyCourses(user!.id),
        enabled: !!user?.id,
    });
};

export const useSubmitAttendance = () => {
    return useMutation({
        mutationFn: ({ sectionId, data }: { sectionId: string, data: any }) => logAttendance(sectionId, data),
    });
};