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
        } catch {
            // Mock data for UI development
            return [
                { id: 'EVT-01', title: 'CS-101: Intro to Computing', type: 'Class', dayOfWeek: 'Monday', time: '09:00 AM - 10:30 AM', location: 'Lab 402' },
                { id: 'EVT-02', title: 'Department Meeting', type: 'Meeting', dayOfWeek: 'Monday', time: '02:00 PM - 03:30 PM', location: 'Conference Room B' },
                { id: 'EVT-03', title: 'Student Consultation', type: 'Consultation', dayOfWeek: 'Tuesday', time: '10:00 AM - 12:00 PM', location: 'Faculty Office 310' },
                { id: 'EVT-04', title: 'CS-305: Database Management', type: 'Class', dayOfWeek: 'Wednesday', time: '01:00 PM - 02:30 PM', location: 'Hall B' },
                { id: 'EVT-05', title: 'CS-101: Intro to Computing', type: 'Class', dayOfWeek: 'Thursday', time: '09:00 AM - 10:30 AM', location: 'Lab 402' },
            ];
        }
    }
};