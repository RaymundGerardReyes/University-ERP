export type AcademicStandingStatus = 'GOOD' | 'PROBATION' | 'DISMISSED';

/**
 * Represents the universal Academic Term boundary.
 */
export interface AcademicTermDto {
    termId: string;
    academicYear: string;
    semester: string;
    isActive: boolean;
    registrationOpen: boolean;
    startDate: string;
    endDate: string;
}

/**
 * Represents a student's official academic status.
 */
export interface AcademicStandingDto {
    standingId: string;
    studentId: string;
    status: AcademicStandingStatus;
    cumulativeGpa: number;
    earnedUnits: number;
    evaluatedOnUtc: string;
}

/**
 * Represents a finalized grade for a specific section.
 */
export interface GradeDto {
    gradeId: string;
    subjectCode: string;
    sectionId: string;
    semesterId: string;
    grade: string;
    gradePoints: number;
    creditsEarned: number;
    isOfficial: boolean;
}

/**
 * Groups a collection of grades under a specific term for the transcript.
 */
export interface TranscriptTermDto {
    term: AcademicTermDto;
    grades: GradeDto[];
    termGpa: number;
}

/**
 * The complete, ordered academic history of a student.
 */
export interface TranscriptDto {
    transcriptId: string;
    studentId: string;
    studentName: string;
    programId: string;
    cumulativeGpa: number;
    totalEarnedUnits: number;
    academicStanding: AcademicStandingStatus;
    terms: TranscriptTermDto[];
}

/**
 * Legacy flat item (retained for backward compatibility if needed).
 */
export interface OfficialGradeItem {
    id: string;
    section: string;
    subject: string;
    credits: number;
    faculty: string;
    status: string;
    grade: string | null;
}