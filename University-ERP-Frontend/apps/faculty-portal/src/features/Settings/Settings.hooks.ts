import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facultySettingsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useFacultySettings = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['facultySettings', identity?.id],
        queryFn: () => facultySettingsApi.getSettings(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};

export const useUpdateSettings = () => {
    const { identity } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: any) => facultySettingsApi.updateSettings(identity?.id || 'FAC-001', settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facultySettings'] });
        }
    });
};