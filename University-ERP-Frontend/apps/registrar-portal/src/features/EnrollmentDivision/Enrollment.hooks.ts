import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEnrollmentValidationQueue, validateEnrollment } from './Enrollment.api';

export const useEnrollmentValidationQueue = () => {
    return useQuery({
        queryKey: ['registrar', 'enrollmentValidation'],
        queryFn: fetchEnrollmentValidationQueue
    });
};

export const useValidateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: validateEnrollment,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrar', 'enrollmentValidation'] })
    });
};
