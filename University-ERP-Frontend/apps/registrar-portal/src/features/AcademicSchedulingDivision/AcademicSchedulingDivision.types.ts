export interface SectionScheduleDto {
    sectionId: string;
    subjectId: string;
    instructorId: string;
    roomId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    capacity: number;
    enrolled: number;
}

export interface CreateSectionScheduleRequest {
    subjectId: string;
    instructorId: string;
    roomId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    capacity: number;
}
