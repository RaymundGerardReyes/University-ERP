import { apiClient } from '@university-erp/api-clients';
import { SectionScheduleDto, CreateSectionScheduleRequest } from './AcademicSchedulingDivision.types';

export const academicSchedulingApi = {
    getSchedules: async (semesterId: string): Promise<SectionScheduleDto[]> => {
        const response = await apiClient.get(`/api/registrar/scheduling/${semesterId}`);
        return response.data;
    },
    
    createSchedule: async (request: CreateSectionScheduleRequest): Promise<SectionScheduleDto> => {
        const response = await apiClient.post('/api/registrar/scheduling', request);
        return response.data;
    }
};
