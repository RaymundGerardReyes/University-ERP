import { useQuery } from '@tanstack/react-query';
import { fetchMasterStudents } from './Registry.api';

export const useMasterStudents = () => {
    return useQuery({
        queryKey: ['registrar', 'masterStudents'],
        queryFn: fetchMasterStudents
    });
};
