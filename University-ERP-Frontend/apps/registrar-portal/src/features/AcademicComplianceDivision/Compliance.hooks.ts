import { useQuery } from '@tanstack/react-query';
import { fetchCHEDReports } from './Compliance.api';

export const useCHEDReports = () => {
    return useQuery({
        queryKey: ['registrar', 'chedReports'],
        queryFn: fetchCHEDReports
    });
};
