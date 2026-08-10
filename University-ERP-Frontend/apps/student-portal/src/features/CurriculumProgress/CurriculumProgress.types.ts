export interface CurriculumProgressDto {
    studentId: string;
    programId: string;
    totalCreditsRequired: number;
    creditsCompleted: number;
    creditsInProgress: number;
    gpa: number;
    completedSubjects: string[];

    // --- NEW PHASE B FIELDS ---
    remainingCourses: string[];
    requiredCourses: string[];
    currentlyRegisteredCourses: string[];
    graduationEligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING_REVIEW';
}

export interface GetCurriculumProgressRequest {
    studentId: string;
}