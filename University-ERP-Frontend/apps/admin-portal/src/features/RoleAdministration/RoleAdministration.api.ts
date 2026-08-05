import axios from 'axios';

// The IdentityAccess bounded context handles role administration
const BASE_URL = '/api/v1/platform/identity/roles';

export interface SecurityRole {
    id: string;
    name: string;
    description: string;
    userCount: number;
    isSystem: boolean;
}

// Removed mock platform role API 
export const fetchSystemRoles = async () => {
  return roleApi.getRoles();
};

export const roleApi = {
    getRoles: async (): Promise<SecurityRole[]> => {
        try {
            const response = await axios.get<SecurityRole[]>(BASE_URL);
            return response.data;
        } catch (error) {
            // Throw error to TanStack React Query boundary
            throw error;
        }
    }
};