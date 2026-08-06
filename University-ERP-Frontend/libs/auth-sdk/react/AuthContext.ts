import { createContext } from 'react';

export interface Identity {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  roles?: string[];
}

export interface AuthContextType {
  identity: Identity | null;
  user: Identity | null;
  isAuthenticated: boolean;
  login: () => void; // Redirects to Identity Portal
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
