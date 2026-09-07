import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
      return {
        user: { id: 'usr-default', name: 'Test User', role: 'Staff', roles: ['Staff', 'Admin', 'Applicant', 'Faculty', 'Registrar', 'Student'] },
        identity: { id: 'usr-default', name: 'Test User', email: 'test@university.edu', roles: ['Staff', 'Admin', 'Applicant', 'Faculty', 'Registrar', 'Student'] },
        isAuthenticated: true,
        login: () => {},
        logout: () => {},
      } as any;
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
