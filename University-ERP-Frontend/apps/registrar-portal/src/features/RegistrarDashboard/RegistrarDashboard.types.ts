export interface RegistrarMetricsDto {
    totalStudents: number;
    pendingEnrollments: number;
    pendingClearances: number;
    crossEnrollmentsPending: number;
}

export interface GetMetricsRequest {
    academicYear: string;
    semesterId: string;
}
