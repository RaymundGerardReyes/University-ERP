import { apiClient } from '@university-erp/api-clients';
import { SystemHealthDto } from './IntegrationManagement.types';

export const fetchSystemHealth = async (): Promise<SystemHealthDto[]> => {
    const response = await apiClient.get<SystemHealthDto[]>('/platform/analytics/integrations/health');
    return response.data;
};