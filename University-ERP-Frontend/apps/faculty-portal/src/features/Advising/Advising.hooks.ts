import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchFacultyAdvisees } from './Advising.api';

export const useAdvisees = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['facultyAdvisees', user?.id],
        queryFn: () => fetchFacultyAdvisees(user!.id),
        enabled: !!user?.id,
    });
};

export const useMyAdvisees = useAdvisees;