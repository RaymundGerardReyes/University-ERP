import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferDivisionApi } from './TransferDivision.api';
import { CreditTransferRequest } from './TransferDivision.types';

export const usePendingTransfers = () => {
    return useQuery({
        queryKey: ['registrar', 'transfers', 'pending'],
        queryFn: transferDivisionApi.getPendingTransfers
    });
};

export const useCreditTransferSubjects = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CreditTransferRequest) => transferDivisionApi.creditSubjects(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrar', 'transfers', 'pending'] });
        }
    });
};
