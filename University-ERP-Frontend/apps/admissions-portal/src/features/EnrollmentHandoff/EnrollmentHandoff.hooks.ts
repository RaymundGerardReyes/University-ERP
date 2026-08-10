import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentHandoffApi } from './EnrollmentHandoff.api';
import { ExecuteHandoffRequest } from './EnrollmentHandoff.types';

export const useApprovedApplicants = () => {
    return useQuery({
        queryKey: ['admissions', 'handoff', 'approved'],
        queryFn: enrollmentHandoffApi.getApprovedApplicants
    });
};

export const useExecuteHandoff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ExecuteHandoffRequest) => enrollmentHandoffApi.executeHandoff(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admissions', 'handoff'] });
            // Note: This triggers the FINANCIAL_ASSESSMENT creation in the Finance Console
        }
    });
};
