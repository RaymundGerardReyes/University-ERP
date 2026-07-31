import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Mock local authentication state for development
    const mockToken = localStorage.getItem('mock_token');
    if (mockToken) {
      setUser({
        id: 'STD-2023-001',
        name: 'Jane Doe',
        email: 'jane.doe@student.university.edu',
        roles: ['Student']
      });
    }
  }, []);

  const login = () => {
    localStorage.setItem('mock_token', 'mock_jwt_token_123');
    setUser({
      id: 'STD-2023-001',
      name: 'Jane Doe',
      email: 'jane.doe@student.university.edu',
      roles: ['Student']
    });
    window.location.href = '/profile';
  };

  const logout = () => {
    localStorage.removeItem('mock_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
