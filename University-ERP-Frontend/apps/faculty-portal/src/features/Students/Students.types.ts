// Legacy export retained for backwards compatibility during migration
export interface FacultyStudent {
    studentId: string;
    name: string;
    program: string;
    riskIndicator: 'Low' | 'Medium' | 'High';
    attendanceRate: number;
    lastBehaviorNote?: string;
}

// New strictly scoped domain models
export type RosterStudentStatus = 'ENROLLED' | 'WAITLISTED' | 'DROPPED';

export interface RosterStudentDto {
    studentId: string;
    studentName: string;
    status: RosterStudentStatus;
    // Merged legacy fields to maintain existing UI risk visualizations
    program?: string;
    riskIndicator?: 'Low' | 'Medium' | 'High';
    attendanceRate?: number;
    lastBehaviorNote?: string;
}

export interface SectionRosterDto {
    sectionId: string;
    sectionCode: string;
    students: RosterStudentDto[];
}