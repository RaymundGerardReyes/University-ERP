import { admissionsApi, JourneyStateDto } from '@university-erp/api-clients';
import { ScheduleInterviewPayload } from './InterviewScheduling.types';

export const interviewSchedulingApi = {
  getApplicantJourney: async (studentId: string): Promise<JourneyStateDto> => {
    return admissionsApi.getApplicantJourney(studentId);
  },

  scheduleInterview: async (payload: ScheduleInterviewPayload): Promise<void> => {
    return admissionsApi.scheduleInterview(payload.applicationId, {
      date: payload.date,
      time: payload.time,
    });
  },
};

