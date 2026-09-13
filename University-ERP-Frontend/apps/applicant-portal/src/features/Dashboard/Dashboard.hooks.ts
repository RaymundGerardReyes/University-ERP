import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useApplicantDashboard = () => {
  const { user, identity } = useAuth();
  const studentId = user?.id || identity?.id;

  return useQuery({
    queryKey: ['applicantJourney', studentId],
    queryFn: () => admissionsApi.getApplicantJourney(studentId!),
    enabled: Boolean(studentId),
    refetchInterval: 10000, // Poll every 10 seconds to catch real-time workflow advancements
  });
};