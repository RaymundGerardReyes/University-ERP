import axios from 'axios';

const BASE_URL = '/api/v1/academic/faculty-students';

export interface FacultyStudent {
    studentId: string;
    name: string;
    program: string;
    riskIndicator: 'Low' | 'Medium' | 'High';
    attendanceRate: number;
    lastBehaviorNote?: string;
}

export const facultyStudentsApi = {
    getMyStudents: async (facultyId: string): Promise<FacultyStudent[]> => {
        try {
            const response = await axios.get<FacultyStudent[]>(`${BASE_URL}/${facultyId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};