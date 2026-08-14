import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';

export const useRegistrarDashboard = () => {
    // Fetch dynamic enrollment validations
    const validationsQuery = useQuery({
        queryKey: ['registrar', 'validations'],
        queryFn: () => registrarApi.getEnrollmentValidationQueue(),
        refetchInterval: 15000 // Real-time polling
    });

    // Fetch dynamic pending graduation/academic clearances
    const clearancesQuery = useQuery({
        queryKey: ['registrar', 'clearances'],
        queryFn: () => registrarApi.getPendingClearances(),
        refetchInterval: 15000
    });

    return {
        validations: validationsQuery.data,
        clearances: clearancesQuery.data,
        isLoading: validationsQuery.isLoading || clearancesQuery.isLoading,
        isError: validationsQuery.isError || clearancesQuery.isError
    };
};

export const useApproveClearance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (studentId: string) => registrarApi.approveClearance(studentId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrar', 'clearances'] })
    });
};
