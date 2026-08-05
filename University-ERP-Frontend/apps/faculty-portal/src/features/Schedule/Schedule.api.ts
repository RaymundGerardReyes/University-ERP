import { scheduleApi } from '@university-erp/api-clients';

export const fetchFacultySchedule = async (facultyId: string) => {
    return scheduleApi.getWeeklySchedule(facultyId);
};