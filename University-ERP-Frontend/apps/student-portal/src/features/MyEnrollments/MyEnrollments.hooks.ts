import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { studentInformationApi } from '@university-erp/api-clients';

export const useMyEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['myEnrollments', user?.id],
    queryFn: () => (studentInformationApi as any).getEnrollments?.(user?.id) ?? null,
    enabled: !!user?.id,
  });
};