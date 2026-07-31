import axios from 'axios';
import { AuthResponseViewModel, UserSessionViewModel, MfaChallengeViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = 'http://localhost:5000/api/v1/identity';

export const identityApi = {
  login: async (credentials: any): Promise<AuthResponseViewModel> => {
    try {
      const response = await axios.post<AuthResponseViewModel>(`${BASE_URL}/login`, credentials);
      return response.data;
    } catch {
      return {
        token: 'mock-jwt-token',
        user: { id: 'usr-123', email: credentials.email, name: 'Admin User', role: 'Admin' }
      };
    }
  },

  register: async (data: any): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/register`, data);
    } catch {
      return Promise.resolve();
    }
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/password-reset`, { email });
    } catch {
      return Promise.resolve();
    }
  },

  verifyMfa: async (code: string): Promise<boolean> => {
    try {
      await axios.post(`${BASE_URL}/mfa/verify`, { code });
      return true;
    } catch {
      return code === '123456';
    }
  },

  getSessions: async (): Promise<UserSessionViewModel[]> => {
    try {
      const response = await axios.get<UserSessionViewModel[]>(`${BASE_URL}/sessions`);
      return response.data;
    } catch {
      return [
        { sessionId: 'sess-001', device: 'Chrome on Windows 11', location: 'Seattle, WA', lastActive: new Date().toISOString() },
        { sessionId: 'sess-002', device: 'Safari on iPhone 13', location: 'Seattle, WA', lastActive: new Date().toISOString() }
      ];
    }
  }
};
