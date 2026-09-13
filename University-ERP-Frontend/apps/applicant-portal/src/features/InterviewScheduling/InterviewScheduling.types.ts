export interface ScheduleInterviewPayload {
  applicationId: string;
  date: string;
  time: string;
}

export interface InterviewSlot {
  time: string;
  available: boolean;
}

export interface ScheduledInterviewInfo {
  date: string;
  time: string;
  detail?: string;
}

