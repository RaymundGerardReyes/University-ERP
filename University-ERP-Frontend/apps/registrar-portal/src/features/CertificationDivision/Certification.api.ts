import { registrarApi } from '@university-erp/api-clients';

export const fetchTranscriptRequests = async () => {
    return registrarApi.getTranscriptRequests();
};
