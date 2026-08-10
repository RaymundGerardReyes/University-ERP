import { useQuery } from '@tanstack/react-query';
import { registrarDashboardApi } from './RegistrarDashboard.api';
import { GetMetricsRequest } from './RegistrarDashboard.types';

export const useRegistrarMetrics = (request: GetMetricsRequest) => {
    return useQuery({
        queryKey: ['registrar', 'metrics', request.academicYear, request.semesterId],
        queryFn: () => registrarDashboardApi.getMetrics(request),
        enabled: !!request.academicYear && !!request.semesterId
    });
};
