// Assuming shared types exist in the generic API clients library, or redefine them here for the frontend boundary
export type AcademicStandingStatus = 'GOOD' | 'PROBATION' | 'DISMISSED';

export interface GradeDto {
    subjectCode: string;
    sectionId: string;
    grade: string;
    gradePoints: number;
    creditsEarned: number;
    isOfficial: boolean;
}

export interface AcademicTermGradeReport {
    termId: string;
    academicYear: string;
    semester: string;
    termGpa: number;
    grades: GradeDto[];
}

export interface StudentAcademicRecordDto {
    studentId: string;
    cumulativeGpa: number;
    totalEarnedUnits: number;
    academicStanding: AcademicStandingStatus;
    termReports: AcademicTermGradeReport[];
}