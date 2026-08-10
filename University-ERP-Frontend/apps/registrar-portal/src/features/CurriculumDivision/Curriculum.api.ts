import { apiClient } from '@university-erp/api-clients';
import { CourseDto, PrerequisiteRuleDto } from './Curriculum.types';

export const curriculumApi = {
    getCourses: async (): Promise<CourseDto[]> => {
        const response = await apiClient.get('/api/curriculum/courses');
        return response.data;
    },
    updatePrerequisite: async (ruleId: string, payload: Partial<PrerequisiteRuleDto>) => {
        const response = await apiClient.patch(`/api/curriculum/prerequisites/${ruleId}`, payload);
        return response.data;
    }
};