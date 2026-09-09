export interface AcademicConfigDto {
    activeTerm: string;
    academicYear: string;
    isTermOpen: boolean;
    isLateEnrollmentAllowed: boolean;
    enrollmentStartDate?: string;
    enrollmentEndDate?: string;
    addDropDeadline?: string;
}

export interface UpdateAcademicConfigPayload {
    termName: string;
    academicYear?: string;
    isLateEnrollmentAllowed?: boolean;
}

