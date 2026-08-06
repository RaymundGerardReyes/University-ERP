import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOfficialGrades, lockSectionGrades } from './Records.api';

export const useOfficialGrades = () => {
    return useQuery({
        queryKey: ['registrar', 'officialGrades'],
        queryFn: fetchOfficialGrades
    });
};

export const useLockGrades = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: lockSectionGrades,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrar', 'officialGrades'] })
    });
};
