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
        } catch {
            return [
                { studentId: 'STU-001', name: 'Alex Morgan', program: 'BSCS', riskIndicator: 'Low', attendanceRate: 98, lastBehaviorNote: 'Excellent participation.' },
                { studentId: 'STU-002', name: 'James Chen', program: 'BSIT', riskIndicator: 'High', attendanceRate: 75, lastBehaviorNote: 'Missed 3 consecutive labs.' },
                { studentId: 'STU-003', name: 'Sarah Jenkins', program: 'BSCS', riskIndicator: 'Medium', attendanceRate: 85 },
            ];
        }
    }
};