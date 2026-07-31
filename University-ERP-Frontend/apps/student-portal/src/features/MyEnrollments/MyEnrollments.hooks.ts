import { useQuery } from '@tanstack/react-query';
import { studentInformationApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useMyEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['studentEnrollments', user?.id],
    queryFn: () => studentInformationApi.getEnrollments(user!.id),
    enabled: !!user?.id,
  });
};