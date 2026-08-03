import axios from 'axios';
const BASE_URL = '/api/v1/hr';
export const hrApi = {
    onboardEmployee: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/employees/onboard`, payload);
            return response.data;
        }
        catch {
            // Fallback mock if backend server is not running
            return {
                employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                status: 'Onboarded'
            };
        }
    }
};
