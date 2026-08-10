import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crossEnrollmentDivisionApi } from './CrossEnrollmentDivision.api';
import { ReviewCrossEnrolleeRequest } from './CrossEnrollmentDivision.types';

export const useIncomingCrossEnrollees = () => {
    return useQuery({
        queryKey: ['registrar', 'cross-enrollment', 'incoming'],
        queryFn: crossEnrollmentDivisionApi.getIncomingRequests
    });
};

export const useReviewCrossEnrollee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ReviewCrossEnrolleeRequest) => crossEnrollmentDivisionApi.reviewRequest(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrar', 'cross-enrollment', 'incoming'] });
        }
    });
};
