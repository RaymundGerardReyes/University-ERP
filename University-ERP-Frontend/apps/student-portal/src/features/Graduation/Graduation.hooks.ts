import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graduationApi } from './Graduation.api';
import { SubmitGraduationApplicationRequest } from './Graduation.types';

export const useGraduationApplication = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'graduation'],
        queryFn: () => graduationApi.getApplicationStatus(studentId),
        enabled: !!studentId
    });
};

export const useSubmitGraduationApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: SubmitGraduationApplicationRequest) => graduationApi.submitApplication(request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId, 'graduation'] });
        }
    });
};
