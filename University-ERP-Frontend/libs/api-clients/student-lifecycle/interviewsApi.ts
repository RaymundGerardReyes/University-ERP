export interface InterviewScheduleDto {
    studentId: string;
    scheduledDate: string;
    scheduledTime: string;
    status: 'Scheduled' | 'Completed' | 'Pending';
}

// LocalStorage key to sync interview state across portals during development
const STORAGE_KEY = 'erp_cross_portal_interview_sync';

export const interviewsApi = {
    getSchedule: async (studentId: string): Promise<InterviewScheduleDto | null> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const rawData = localStorage.getItem(STORAGE_KEY);
        if (rawData) {
            const schedules: Record<string, InterviewScheduleDto> = JSON.parse(rawData);
            return schedules[studentId] || null;
        }
        return null;
    },

    scheduleInterview: async (payload: { studentId: string; date: string; time: string }): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const rawData = localStorage.getItem(STORAGE_KEY) || '{}';
        const schedules: Record<string, InterviewScheduleDto> = JSON.parse(rawData);
        
        schedules[payload.studentId] = {
            studentId: payload.studentId,
            scheduledDate: payload.date,
            scheduledTime: payload.time,
            status: 'Scheduled'
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
        return true;
    }
};
