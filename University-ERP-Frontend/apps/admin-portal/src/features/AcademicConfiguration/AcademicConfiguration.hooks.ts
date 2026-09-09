import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAcademicConfig, updateAcademicConfig } from './AcademicConfiguration.api';
import { UpdateAcademicConfigPayload } from './AcademicConfiguration.types';

export function useAcademicConfig() {
    return useQuery({
        queryKey: ['academicConfiguration'],
        queryFn: () => fetchAcademicConfig(),
    });
}

export function useUpdateAcademicConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateAcademicConfigPayload) => updateAcademicConfig(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academicConfiguration'] });
        },
    });
}

