import { useQuery } from '@tanstack/react-query';
import { fetchSessions } from './SessionManagement.api';
export const useSessionManagement = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: fetchSessions
    });
};
