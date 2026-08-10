import { apiClient } from '@university-erp/api-clients';
import { CurriculumProgressDto } from './CurriculumProgress.types';

export const curriculumProgressApi = {
    getProgress: async (studentId: string): Promise<CurriculumProgressDto> => {
        const response = await apiClient.get(`/api/student/${studentId}/curriculum-progress`);
        return response.data;
    }
};
