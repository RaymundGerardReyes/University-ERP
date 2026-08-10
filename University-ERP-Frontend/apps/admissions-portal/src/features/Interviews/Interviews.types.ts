export interface InterviewDto {
    interviewId: string;
    applicantId: string;
    scheduledAt: string;
    interviewerId: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    meetingLink?: string;
    remarks?: string;
}

export interface ScheduleInterviewRequest {
    applicantId: string;
    scheduledAt: string;
    interviewerId: string;
}
