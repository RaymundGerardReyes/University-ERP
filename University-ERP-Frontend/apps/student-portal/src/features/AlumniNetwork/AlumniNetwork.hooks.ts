import { useQuery } from '@tanstack/react-query';
import { alumniApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useAlumniStatus = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['alumniStatus', user?.id],
    queryFn: () => alumniApi.getAlumniStatus(user!.id),
    enabled: !!user?.id,
  });
};