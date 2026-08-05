import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSystemConfig, updateSystemConfig } from './SystemAdministration.api';

export const useSystemConfig = () => {
    return useQuery({
        queryKey: ['systemConfig'],
        queryFn: fetchSystemConfig,
    });
};

export const useToggleConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ key, value }: { key: string; value: boolean }) => updateSystemConfig(key, value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
        }
    });
};