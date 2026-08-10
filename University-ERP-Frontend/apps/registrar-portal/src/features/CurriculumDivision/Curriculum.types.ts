export interface PrerequisiteRuleDto {
    ruleId: string;
    courseId: string;
    requiredCourseId: string;
    minimumGrade: string;
    isEnforced: boolean;
}

export interface CourseDto {
    courseId: string;
    code: string;
    title: string;
    units: number;
    prerequisites: PrerequisiteRuleDto[];
}

export interface SubjectCatalogItem {
    code: string;
    title: string;
    units: number;
    prerequisites: string;
    status: string;
}

export interface SectionDto {
    sectionId: string;
    sectionCode: string;
    courseId: string;
    instructorId: string;
    schedule: string;
    capacity: number;
    enrolledCount: number;
    waitlistCount: number;
}

export interface CourseOfferingDto {
    offeringId: string;
    termId: string;
    course: CourseDto;
    sections: SectionDto[];
}

export interface CurriculumVersionDto {
    versionId: string;
    programId: string;
    effectiveYear: string;
    courses: CourseDto[];
}