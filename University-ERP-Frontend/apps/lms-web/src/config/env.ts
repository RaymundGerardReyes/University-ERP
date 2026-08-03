export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  AUTH_AUTHORITY: import.meta.env.VITE_AUTH_AUTHORITY || 'http://localhost:3001/mock-auth',
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID || 'lms-web-client'
};
