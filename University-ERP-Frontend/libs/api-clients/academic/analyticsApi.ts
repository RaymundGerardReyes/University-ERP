import axios from 'axios';

const BASE_URL = '/api/v1/academic/analytics';

export interface ClassPerformance {
    courseCode: string;
    averageGrade: number;
    passRate: number;
    atRiskCount: number;
}

export const analyticsApi = {
    getClassPerformance: async (facultyId: string): Promise<ClassPerformance[]> => {
        try {
            const response = await axios.get<ClassPerformance[]>(`${BASE_URL}/${facultyId}/performance`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAdmissionsReport: async (): Promise<any> => {
        try {
            const response = await axios.get('/api/v1/analytics/admissions-report');
            return response.data;
        } catch (error) {
            console.error('Failed to get admissions report', error);
            throw error;
        }
    }
};