import axios from 'axios';
import { SystemHealthDto } from './IntegrationManagement.types';

export const fetchSystemHealth = async (): Promise<SystemHealthDto[]> => {
    const response = await axios.get('/api/v1/platform/analytics/integrations/health');
    return response.data;
};