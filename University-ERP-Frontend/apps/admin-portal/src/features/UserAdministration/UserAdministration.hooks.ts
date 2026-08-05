import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSystemUsers, revokeUserAccess } from './UserAdministration.api';

export const useSystemUsers = () => {
    return useQuery({
        queryKey: ['systemUsers'],
        queryFn: fetchSystemUsers,
    });
};

export const useRevokeAccess = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => revokeUserAccess(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
        }
    });
};