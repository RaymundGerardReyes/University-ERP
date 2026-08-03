import axios from 'axios';
const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});
// Setup auth interceptor later when auth-sdk is fully integrated
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mock_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const studentInformationApi = {
    getProfile: async (studentId) => {
        const response = await apiClient.get(`/students/${studentId}/profile`);
        return response.data;
    },
    getEnrollments: async (studentId) => {
        const response = await apiClient.get(`/students/${studentId}/enrollments`);
        return response.data;
    }
};
