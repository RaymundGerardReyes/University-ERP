import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crossEnrollmentApi } from './CrossEnrollment.api';
import { SubmitCrossEnrollmentRequest } from './CrossEnrollment.types';

export const useCrossEnrollmentRequests = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'cross-enrollment'],
        queryFn: () => crossEnrollmentApi.getRequests(studentId),
        enabled: !!studentId
    });
};

export const useSubmitCrossEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: SubmitCrossEnrollmentRequest) => crossEnrollmentApi.submitRequest(request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId, 'cross-enrollment'] });
        }
    });
};
