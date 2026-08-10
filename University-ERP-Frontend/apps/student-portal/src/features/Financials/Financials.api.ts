import { apiClient } from '@university-erp/api-clients';
import { StudentInvoiceDto } from './Financials.types';

export const financialsApi = {
    getCurrentTermInvoice: async (studentId: string, termId: string): Promise<StudentInvoiceDto> => {
        const response = await apiClient.get(`/api/student/${studentId}/financials/invoice?termId=${termId}`);
        return response.data;
    }
};