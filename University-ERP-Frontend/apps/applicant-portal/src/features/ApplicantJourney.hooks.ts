import { useEffect, useState } from 'react';
import { admissionsApi, JourneyStateDto } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

// Re-export DTO types for consumers of this hook
export type { JourneyStateDto, JourneyMilestoneDto, ProgramOfferingDto, ApplicantDocumentDto } from '@university-erp/api-clients';

export const useApplicantJourney = () => {
  const [data, setData] = useState<JourneyStateDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, identity } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchJourney = async () => {
      setIsLoading(true);
      try {
        const studentId = user?.id || identity?.id || '322e4090-9e05-438b-95d8-28088085abc4';
        const result = await admissionsApi.getApplicantJourney(studentId);

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to load applicant journey", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchJourney();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return { data, isLoading, refetch: () => setData(null) };
};
