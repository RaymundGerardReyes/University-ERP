export interface ScheduleEventDto {
    eventId: string;
    studentId: string;
    subjectId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string;
    instructor: string;
}

export interface GetScheduleRequest {
    studentId: string;
    semesterId: string;
}
