import axios from 'axios';

const BASE_URL = '/api/v1/academic/schedule';

export interface ScheduleEvent {
    id: string;
    title: string;
    type: 'Class' | 'Consultation' | 'Meeting';
    dayOfWeek: string;
    time: string;
    location: string;
}

export const scheduleApi = {
    getWeeklySchedule: async (facultyId: string): Promise<ScheduleEvent[]> => {
        try {
            const response = await axios.get<ScheduleEvent[]>(`${BASE_URL}/${facultyId}/weekly`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};