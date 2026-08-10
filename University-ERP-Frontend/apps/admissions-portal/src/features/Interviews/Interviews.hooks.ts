import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewsApi } from './Interviews.api';
import { ScheduleInterviewRequest } from './Interviews.types';

export const useInterviews = () => {
    return useQuery({
        queryKey: ['admissions', 'interviews'],
        queryFn: interviewsApi.getInterviews
    });
};

export const useScheduleInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ScheduleInterviewRequest) => interviewsApi.scheduleInterview(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admissions', 'interviews'] });
        }
    });
};
