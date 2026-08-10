/**
 * Represents the complete lifecycle of a student's registration status.
 */
export type RegistrationStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'VALIDATING'
    | 'VALIDATED'
    | 'WAITLISTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'DROPPED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'WITHDRAWN';

/**
 * A lightweight reference to the Academic Term boundary.
 */
export interface AcademicTermRef {
    termId: string;
    academicYear: string;
    semester: string;
}

/**
 * Represents an individual subject/section within a registration request.
 */
export interface RegistrationLineItem {
    lineItemId: string;
    sectionId: string;
    courseId: string;
    subjectCode: string;
    credits: number;
    status: RegistrationStatus;
}

/**
 * Represents a student's position in a waitlisted section.
 */
export interface WaitlistEntry {
    waitlistId: string;
    sectionId: string;
    courseId: string;
    position: number;
    status: 'ACTIVE' | 'NOTIFIED' | 'EXPIRED' | 'PROMOTED';
    addedAtUtc: string;
}

/**
 * The core Registration Data Transfer Object.
 */
export interface RegistrationDto {
    registrationId: string;
    studentId: string;
    term: AcademicTermRef;
    status: RegistrationStatus;
    enrolledCredits: number;
    lineItems: RegistrationLineItem[];
    waitlistEntries: WaitlistEntry[];
    updatedAtUtc: string;
}

export interface SubmitRegistrationRequest {
    studentId: string;
    termId: string;
    sectionIds: string[];
}