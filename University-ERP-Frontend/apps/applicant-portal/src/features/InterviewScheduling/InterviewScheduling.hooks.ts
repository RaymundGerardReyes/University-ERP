import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { interviewSchedulingApi } from './InterviewScheduling.api';
import { ScheduleInterviewPayload } from './InterviewScheduling.types';

export const useInterviewScheduleData = (explicitStudentId?: string) => {
  const { user, identity } = useAuth();
  const studentId = explicitStudentId || user?.id || identity?.id;

  return useQuery({
    queryKey: ['applicantJourney', studentId],
    queryFn: () => interviewSchedulingApi.getApplicantJourney(studentId!),
    enabled: Boolean(studentId),
  });
};

export const useScheduleInterview = (studentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleInterviewPayload) =>
      interviewSchedulingApi.scheduleInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicantJourney', studentId] });
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
    },
  });
};

