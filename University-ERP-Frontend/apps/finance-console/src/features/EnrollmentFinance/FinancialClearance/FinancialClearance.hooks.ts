import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialClearanceApi } from './FinancialClearance.api';
import { IssueClearanceRequest } from './FinancialClearance.types';

export const usePendingClearances = () => {
    return useQuery({
        queryKey: ['finance', 'clearances', 'pending'],
        queryFn: financialClearanceApi.getPendingClearances
    });
};

export const useIssueClearance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: IssueClearanceRequest) => financialClearanceApi.issueClearance(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'clearances', 'pending'] });
            // Emit integration event for Registrar activation
        }
    });
};
