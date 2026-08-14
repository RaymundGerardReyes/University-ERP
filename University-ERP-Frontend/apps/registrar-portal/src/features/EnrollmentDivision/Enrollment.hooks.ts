import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { EnrollmentValidationItem } from './Enrollment.types';

export const useEnrollmentValidationQueue = () => {
    return useQuery<EnrollmentValidationItem[]>({
        queryKey: ['enrollmentValidationQueue'],
        queryFn: async () => {
            const data = await registrarApi.getEnrollmentValidationQueue();
            return (data || []).map((item: any) => ({
                id: item.studentId || item.id || 'STU-2026-000',
                studentName: item.fullName || item.studentName || 'Student Name',
                units: item.enrolledCredits ?? item.units ?? 15,
                status: item.status || 'Pending Review'
            }));
        }
    });
};

export const useValidateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            // Mock backend validation call
            return new Promise((resolve) => setTimeout(() => resolve({ success: true, id }), 500));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollmentValidationQueue'] });
        }
    });
};

// Newly added hooks for Phase C
export const useRegistrationWindows = () => {
    return useQuery<any[]>({
        queryKey: ['registrationWindows'],
        queryFn: async () => []
    });
};

export const useRegistrationRequests = () => {
    return useQuery<any[]>({
        queryKey: ['registrationRequests'],
        queryFn: async () => []
    });
};

export const useAddDropRequests = () => {
    return useQuery<any[]>({
        queryKey: ['addDropRequests'],
        queryFn: async () => []
    });
};

export const useWaitlists = () => {
    return useQuery<any[]>({
        queryKey: ['waitlists'],
        queryFn: async () => []
    });
};

export const useRegistrationExceptions = () => {
    return useQuery<any[]>({
        queryKey: ['registrationExceptions'],
        queryFn: async () => []
    });
};

export const useProcessException = () => {
    return useMutation({
        mutationFn: async (payload: any) => ({ success: true })
    });
};