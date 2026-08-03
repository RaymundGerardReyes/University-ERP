import axios from 'axios';
const BASE_URL = '/api/v1/health';
export const healthCenterApi = {
    getAppointments: async (studentId) => {
        try {
            const response = await axios.get(`${BASE_URL}/appointments/${studentId}`);
            return response.data;
        }
        catch {
            return [
                {
                    id: 'HA-882',
                    doctorName: 'Dr. Sarah Jenkins',
                    specialty: 'General Medicine',
                    date: '2026-08-05',
                    time: '10:30 AM',
                    status: 'Scheduled'
                }
            ];
        }
    }
};
