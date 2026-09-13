import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

// Re-export DTO types for consumers of this hook
export type {
  JourneyStateDto,
  JourneyMilestoneDto,
  ProgramOfferingDto,
  ApplicantDocumentDto,
} from '@university-erp/api-clients';

export const useApplicantJourney = (explicitStudentId?: string) => {
  const { user, identity } = useAuth();
  const studentId = explicitStudentId || user?.id || identity?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['applicantJourney', studentId],
    queryFn: () => admissionsApi.getApplicantJourney(studentId!),
    enabled: Boolean(studentId),
  });

  return { data, isLoading, isError, refetch };
};
