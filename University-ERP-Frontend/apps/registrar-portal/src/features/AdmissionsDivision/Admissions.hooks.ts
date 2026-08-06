import { useQuery } from '@tanstack/react-query';
import { fetchAdmissionsQueue } from './Admissions.api';

export const useAdmissionsQueue = () => {
    return useQuery({
        queryKey: ['registrar', 'admissionsQueue'],
        queryFn: fetchAdmissionsQueue
    });
};
