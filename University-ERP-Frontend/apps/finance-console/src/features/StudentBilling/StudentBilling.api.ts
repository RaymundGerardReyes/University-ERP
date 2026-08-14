import { apiClient } from '@university-erp/api-clients';

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
        const response = await apiClient.get<StudentBillingDto[]>('/api/v1/finance/billings');
        return response.data;
    }
};
