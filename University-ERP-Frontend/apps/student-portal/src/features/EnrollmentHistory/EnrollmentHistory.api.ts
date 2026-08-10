import { apiClient } from '@university-erp/api-clients';
import { EnrollmentHistoryRecordDto } from './EnrollmentHistory.types';

export const enrollmentHistoryApi = {
    getHistory: async (studentId: string): Promise<EnrollmentHistoryRecordDto[]> => {
        const response = await apiClient.get(`/api/student/${studentId}/enrollment-history`);
        return response.data;
    }
};
