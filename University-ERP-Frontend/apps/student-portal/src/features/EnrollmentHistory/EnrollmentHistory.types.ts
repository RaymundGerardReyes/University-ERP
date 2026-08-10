export interface EnrollmentHistoryRecordDto {
    semesterId: string;
    semesterName: string;
    academicYear: string;
    enrolledCredits: number;
    gpa: number;
    status: 'COMPLETED' | 'ONGOING' | 'DROPPED';
}

export interface GetEnrollmentHistoryRequest {
    studentId: string;
}
