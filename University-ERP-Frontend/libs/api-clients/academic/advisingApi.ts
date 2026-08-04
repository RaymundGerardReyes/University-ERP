import axios from 'axios';

const BASE_URL = '/api/v1/academic/advising';

export interface Advisee {
    studentId: string;
    name: string;
    program: string;
    degreeProgress: number;
    status: 'On Track' | 'At Risk' | 'Action Required';
}

export const advisingApi = {
    getAdvisees: async (facultyId: string): Promise<Advisee[]> => {
        try {
            const response = await axios.get<Advisee[]>(`${BASE_URL}/${facultyId}/advisees`);
            return response.data;
        } catch {
            return [
                { studentId: 'STU-1042', name: 'Michael Ross', program: 'BSCS', degreeProgress: 85, status: 'On Track' },
                { studentId: 'STU-1045', name: 'Rachel Zane', program: 'BSIT', degreeProgress: 45, status: 'At Risk' },
                { studentId: 'STU-1088', name: 'Donna Paulsen', program: 'BSCS', degreeProgress: 98, status: 'Action Required' },
            ];
        }
    }
};