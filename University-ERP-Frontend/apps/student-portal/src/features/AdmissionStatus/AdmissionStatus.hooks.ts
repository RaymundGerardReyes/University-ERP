import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useAdmissionStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admissionStatus', user?.id],
    queryFn: () => admissionsApi.getApplicationStatus(user!.id),
    enabled: !!user?.id,
  });
};