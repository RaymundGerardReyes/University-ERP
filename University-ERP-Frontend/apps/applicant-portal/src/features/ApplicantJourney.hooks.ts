import { useEffect, useState } from 'react';

export interface JourneyMilestone {
  id: string;
  title: string;
  status: 'Completed' | 'Pending' | 'Active' | 'Locked';
  dateCompleted?: string;
  description: string;
}

export interface Program {
  id: string;
  college: string;
  degree: string;
  major: string;
  duration: string;
  tuitionEstimate: string;
  intake: string;
  tags: string[];
}

export interface ApplicantDocument {
  id: string;
  name: string;
  status: 'Verified' | 'Pending' | 'Uploaded' | 'Rejected' | 'Needs Resubmission';
  uploadedAt?: string;
  feedback?: string;
}

export interface JourneyState {
  applicantName: string;
  applicantId: string;
  currentStage: number;
  milestones: JourneyMilestone[];
  programs: Program[];
  documents: ApplicantDocument[];
  timeline: { date: string; event: string; detail: string }[];
}

import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useApplicantJourney = () => {
  const [data, setData] = useState<JourneyState | null>(null);
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
