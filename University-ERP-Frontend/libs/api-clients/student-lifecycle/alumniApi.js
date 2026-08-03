import axios from 'axios';
const BASE_URL = '/api/v1/alumni';
export const alumniApi = {
    getAlumniStatus: async (studentId) => {
        try {
            const response = await axios.get(`${BASE_URL}/status/${studentId}`);
            return response.data;
        }
        catch {
            return {
                id: 'ALUM-001',
                alumniStatus: 'Registered',
                benefitsActive: true,
                graduationYear: '2026',
                chapter: 'North America Chapter'
            };
        }
    }
};
