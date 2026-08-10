import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicSchedulingApi } from './AcademicSchedulingDivision.api';
import { CreateSectionScheduleRequest } from './AcademicSchedulingDivision.types';

export const useSectionSchedules = (semesterId: string) => {
    return useQuery({
        queryKey: ['registrar', 'scheduling', semesterId],
        queryFn: () => academicSchedulingApi.getSchedules(semesterId),
        enabled: !!semesterId
    });
};

export const useCreateSectionSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CreateSectionScheduleRequest) => academicSchedulingApi.createSchedule(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrar', 'scheduling'] });
        }
    });
};
