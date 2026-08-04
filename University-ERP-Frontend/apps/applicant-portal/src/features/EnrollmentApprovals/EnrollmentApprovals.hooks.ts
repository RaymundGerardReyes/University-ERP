import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyAdmissionsApi } from '@university-erp/api-clients';

export const usePendingApplications = (department: string) => {
    return useQuery({
        queryKey: ['pendingApplications', department],
        queryFn: () => facultyAdmissionsApi.getPendingApplications(department),
    });
};

export const useApproveApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action }: { id: string, action: 'Verify' | 'Approve' }) =>
            facultyAdmissionsApi.approveApplication(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        }
    });
};