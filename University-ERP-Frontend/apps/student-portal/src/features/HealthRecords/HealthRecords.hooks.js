import { useQuery } from '@tanstack/react-query';
import { healthCenterApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
export const useHealthAppointments = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['healthAppointments', user?.id],
        queryFn: () => healthCenterApi.getAppointments(user.id),
        enabled: !!user?.id,
    });
};
