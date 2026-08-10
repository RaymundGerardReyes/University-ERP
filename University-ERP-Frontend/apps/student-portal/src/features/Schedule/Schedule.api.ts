import { apiClient } from '@university-erp/api-clients';
import { ScheduleEventDto } from './Schedule.types';

export const scheduleApi = {
    getStudentSchedule: async (studentId: string, semesterId: string): Promise<ScheduleEventDto[]> => {
        const response = await apiClient.get(`/api/student/${studentId}/schedule?semesterId=${semesterId}`);
        return response.data;
    }
};
