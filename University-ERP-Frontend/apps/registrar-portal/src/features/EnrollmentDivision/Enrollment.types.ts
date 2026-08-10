export interface RegistrationWindowDto {
    windowId: string;
    termId: string;
    studentGroup: string; // e.g., "Seniors", "Freshmen"
    openAt: string;
    closeAt: string;
    isOpen: boolean;
}

export interface RegistrationRequestDto {
    requestId: string;
    studentId: string;
    termId: string;
    lineItems: { courseId: string; sectionId: string; status: string }[];
    validationErrors: string[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedAt: string;
}

export interface WaitlistEntryDto {
    waitlistId: string;
    studentId: string;
    sectionId: string;
    courseCode: string;
    position: number;
    status: 'ACTIVE' | 'PROMOTED' | 'EXPIRED';
}

export interface AddDropRequestDto {
    requestId: string;
    studentId: string;
    action: 'ADD' | 'DROP';
    courseCode: string;
    sectionId: string;
    reason: string;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
}

export interface RegistrationExceptionDto {
    exceptionId: string;
    studentId: string;
    requestType: 'PREREQUISITE_WAIVER' | 'OVERLOAD' | 'LATE_REGISTRATION';
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
}

export interface EnrollmentValidationItem {
    id: string;
    studentName: string;
    units: number;
    status: string;
}