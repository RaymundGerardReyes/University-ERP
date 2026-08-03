import axios from 'axios';
const BASE_URL = '/api/v1/guidance';
export const guidanceApi = {
    getSessions: async (studentId) => {
        try {
            const response = await axios.get(`${BASE_URL}/sessions/${studentId}`);
            return response.data;
        }
        catch {
            return [
                {
                    id: 'GC-101',
                    counselorName: 'Dr. Emily Vance',
                    sessionType: 'Academic',
                    date: '2026-08-10',
                    time: '11:00 AM',
                    status: 'Scheduled',
                    meetingLink: 'https://meet.university.edu/gc-101'
                }
            ];
        }
    }
};
