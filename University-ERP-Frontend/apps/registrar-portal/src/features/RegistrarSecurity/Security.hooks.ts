import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from './Security.api';

export const useAuditLogs = () => {
    return useQuery({
        queryKey: ['registrar', 'auditLogs'],
        queryFn: fetchAuditLogs
    });
};
