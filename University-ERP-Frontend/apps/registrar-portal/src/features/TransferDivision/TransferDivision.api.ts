import { apiClient } from '@university-erp/api-clients';
import { TransferCredentialDto, CreditTransferRequest } from './TransferDivision.types';

export const transferDivisionApi = {
    getPendingTransfers: async (): Promise<TransferCredentialDto[]> => {
        const response = await apiClient.get('/api/registrar/transfers/pending');
        return response.data;
    },
    
    creditSubjects: async (request: CreditTransferRequest): Promise<void> => {
        await apiClient.post(`/api/registrar/transfers/${request.transferId}/credit`, request);
    }
};
