import { apiClient } from '@university-erp/api-clients';
import { InterviewDto, ScheduleInterviewRequest } from './Interviews.types';

export const interviewsApi = {
    getInterviews: async (): Promise<InterviewDto[]> => {
        const response = await apiClient.get('/api/admissions/interviews');
        return response.data;
    },
    
    scheduleInterview: async (request: ScheduleInterviewRequest): Promise<InterviewDto> => {
        const response = await apiClient.post('/api/admissions/interviews', request);
        return response.data;
    }
};
