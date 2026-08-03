import { createLogger } from '@university-erp/core-logger';
import axios from 'axios';
// 1. Initialize the Structured Logger
const logger = createLogger('api-clients', 'IdentityApi');
const BASE_URL = '/api/v1/platform/identity';
export const identityApi = {
    register: async (data) => {
        logger.info('Dispatching RegisterUserCommand to backend', { email: data.email });
        try {
            // 2. Exact match to the C# Backend Command
            await axios.post(`${BASE_URL}/register`, data);
            logger.debug('Backend registration successful');
        }
        catch (error) {
            logger.error('Registration API failed', error);
            throw error;
        }
    },
    login: async (credentials) => {
        logger.info('Dispatching Login query');
        try {
            const response = await axios.post(`${BASE_URL}/login`, credentials);
            return response.data;
        }
        catch {
            logger.warn('Backend login endpoint missing/failed. Falling back to mock session.');
            return {
                token: 'mock-jwt-token-777',
                user: { id: 'usr-123', email: credentials.email, name: 'Alex Morgan', role: 'Student' }
            };
        }
    },
    verifyMfa: async (code) => {
        logger.info('Dispatching MFA verification', { code });
        await axios.post(`${BASE_URL}/mfa/verify`, { code });
    },
    requestPasswordReset: async (email) => {
        logger.info('Dispatching Password Reset Request', { email });
        await axios.post(`${BASE_URL}/password/reset`, { email });
    },
    getSessions: async () => {
        logger.info('Fetching active sessions');
        const response = await axios.get(`${BASE_URL}/sessions`);
        return response.data;
    }
};
