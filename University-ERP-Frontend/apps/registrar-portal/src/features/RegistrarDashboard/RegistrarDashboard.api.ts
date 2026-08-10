import { apiClient } from '@university-erp/api-clients';
import { RegistrarMetricsDto, GetMetricsRequest } from './RegistrarDashboard.types';

export const registrarDashboardApi = {
    getMetrics: async (request: GetMetricsRequest): Promise<RegistrarMetricsDto> => {
        const response = await apiClient.get('/api/registrar/metrics', { params: request });
        return response.data;
    }
};
