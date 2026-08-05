import axios from 'axios';

const BASE_URL = '/api/v1/academic/assessments';

export interface StudentGradeRecord {
    studentId: string;
    studentName: string;
    prelim: number | null;
    midterm: number | null;
    final: number | null;
    status: 'Graded' | 'Pending' | 'Incomplete';
}

export const assessmentApi = {
    getGradebook: async (sectionId: string): Promise<StudentGradeRecord[]> => {
        try {
            const response = await axios.get<StudentGradeRecord[]>(`${BASE_URL}/gradebook/${sectionId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    submitGrades: async (sectionId: string, payload: any): Promise<boolean> => {
        try {
            await axios.post(`${BASE_URL}/gradebook/${sectionId}/submit`, payload);
            return true;
        } catch (error) {
            throw error;
        }
    }
};