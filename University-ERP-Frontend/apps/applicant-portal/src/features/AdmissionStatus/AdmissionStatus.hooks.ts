import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchAdmissionStatus } from './AdmissionStatus.api';

export const useAdmissionStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admissionStatus', user?.id],
    queryFn: () => fetchAdmissionStatus(user!.id),
    enabled: !!user?.id,
  });
};