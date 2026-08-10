import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrationApi } from './Registration.api';
import { SubmitRegistrationRequest } from './Registration.types';

// Existing Legacy Hooks
export const useCurrentRegistration = (studentId: string, termId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'registration', termId],
        queryFn: () => registrationApi.getCurrentRegistration(studentId, termId),
        enabled: !!studentId && !!termId
    });
};

export const useSubmitRegistration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: SubmitRegistrationRequest) => registrationApi.submitRegistration(request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId, 'registration'] });
        }
    });
};

// --- NEW PHASE B HOOKS ---

export const useBrowseCourses = (termId: string, filters?: Record<string, any>) => {
    return useQuery({
        queryKey: ['courses', termId, filters],
        queryFn: () => registrationApi.browseCourses(termId, filters),
        enabled: !!termId
    });
};

export const useAddCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, sectionId, termId }: { studentId: string, sectionId: string, termId: string }) =>
            registrationApi.addCourse(studentId, sectionId, termId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId, 'registration'] });
        }
    });
};

export const useDropCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, lineItemId, reason }: { studentId: string, lineItemId: string, reason?: string }) =>
            registrationApi.dropCourse(studentId, lineItemId, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId, 'registration'] });
        }
    });
};

export const useJoinWaitlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, sectionId }: { studentId: string, sectionId: string }) =>
            registrationApi.joinWaitlist(studentId, sectionId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId, 'registration'] });
        }
    });
};