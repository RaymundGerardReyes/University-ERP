import { apiClient } from '@university-erp/api-clients';
import { toSafeArray } from '../../utils/arrayUtils';

export interface StudentBillingDto {
    id: string;
    studentId: string;
    totalAmount: number;
    paidAmount: number;
    outstandingBalance: number;
    description: string;
    status: string;
    issuedOnUtc: string;
}

export const studentBillingApi = {
    getAllBillings: async (): Promise<StudentBillingDto[]> => {
        const response = await apiClient.get<StudentBillingDto[]>('/finance/billings');
        return toSafeArray<StudentBillingDto>(response.data);
    }
};
