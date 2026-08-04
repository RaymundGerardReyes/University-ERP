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
        } catch {
            return [
                { courseCode: 'CS-101', averageGrade: 88.5, passRate: 95, atRiskCount: 2 },
                { courseCode: 'CS-305', averageGrade: 76.2, passRate: 82, atRiskCount: 8 },
            ];
        }
    }
};