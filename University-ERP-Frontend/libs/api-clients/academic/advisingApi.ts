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
        } catch (error) {
            throw error;
        }
    }
};