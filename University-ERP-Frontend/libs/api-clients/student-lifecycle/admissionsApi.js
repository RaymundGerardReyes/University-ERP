import axios from 'axios';
const BASE_URL = '/api/v1/admissions';
export const admissionsApi = {
    getApplicationStatus: async (studentId) => {
        try {
            const response = await axios.get(`${BASE_URL}/status/${studentId}`);
            return response.data;
        }
        catch {
            // Fallback mock if backend server is not running
            return [
                {
                    id: 'APP-2026-0891',
                    programName: 'B.S. Computer Science & Engineering',
                    status: 'Enrolled',
                    submittedDate: '2026-02-15T10:00:00Z',
                    missingDocuments: []
                }
            ];
        }
    }
};
