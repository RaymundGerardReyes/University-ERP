import { apiClient } from '../apiClient';

export interface ContentItemDto {
    id: string;
    name: string;
    contentType: string;
    resourceUrl: string;
}

export interface LearningModuleDto {
    id: string;
    title: string;
    description: string;
    orderSequence: number;
    items: ContentItemDto[];
}

export interface CourseContentDto {
    syllabusId: string;
    sectionId: string;
    title: string;
    description: string;
    modules: LearningModuleDto[];
}

export interface CoursePackageDto {
    id: string;
    courseCode: string;
    title: string;
    versionManifest: string;
    sizeInBytes: number;
    sizeFormatted: string;
    instructor: string;
    totalLessons: number;
    completedLessons: number;
    isVerified: boolean;
    status: 'Draft' | 'Compiled' | 'Published' | 'Archived';
    updatedAt: string;
}

export interface OfflineSubmissionDto {
    id: string;
    studentId: string;
    studentName: string;
    courseCode: string;
    assignmentId: string;
    assignmentTitle: string;
    essayContent?: string;
    scheduleToken: string;
    syncedAtUtc: string;
    status: 'Pending Review' | 'Graded' | 'Rejected';
    score?: number;
    maxScore: number;
    feedback?: string;
}

export interface GradebookRecordDto {
    id: string;
    studentId: string;
    studentName: string;
    courseCode: string;
    finalScore: number;
    letterGrade: string;
    registrarStatus: 'Synced' | 'Not Synced' | 'Pending Approval';
    lastSyncedAt?: string;
}

export interface AssignmentDto {
    id: string;
    courseId: string;
    title: string;
    instructions: string;
    dueDate: string;
    points: number;
    status: 'Draft' | 'Published' | 'Archived';
}

export interface QuizDto {
    id: string;
    courseId: string;
    title: string;
    timeLimitMinutes: number;
    totalQuestions: number;
    status: 'Available' | 'Locked' | 'Completed';
}

export interface ModuleTimelineItemDto {
    id: string;
    title: string;
    type: 'Lesson' | 'Assignment' | 'Quiz';
    status: 'Active' | 'Completed' | 'Locked' | 'Pending';
    due?: string;
}

export interface DiscussionPostDto {
    id: string;
    courseId: string;
    authorName: string;
    authorRole: string;
    title: string;
    content: string;
    createdAt: string;
    replyCount: number;
}

export interface CalendarEventDto {
    id: string;
    title: string;
    date: string;
    type: 'Assignment' | 'Quiz' | 'Lecture' | 'Exam';
    courseCode: string;
}

export const lmsApi = {
    // Course Syllabus & Content
    getCourseContent: async (sectionId: string): Promise<CourseContentDto> => {
        const response = await apiClient.get(`/api/v1/academic/lms/courses/${sectionId}/content`);
        return response.data;
    },
    createSyllabus: async (sectionId: string, payload: any) => {
        const response = await apiClient.post(`/api/v1/academic/lms/courses/${sectionId}/syllabus`, { sectionId, ...payload });
        return response.data;
    },
    addModule: async (sectionId: string, payload: any) => {
        const response = await apiClient.post(`/api/v1/academic/lms/courses/${sectionId}/modules`, { sectionId, ...payload });
        return response.data;
    },
    addContentItem: async (sectionId: string, moduleId: string, payload: any) => {
        const response = await apiClient.post(`/api/v1/academic/lms/courses/${sectionId}/modules/${moduleId}/content`, { sectionId, moduleId, ...payload });
        return response.data;
    },

    // Course Packaging & Offline Distribution
    getPackages: async (): Promise<CoursePackageDto[]> => {
        const response = await apiClient.get('/api/v1/lms/packages');
        return response.data;
    },
    compilePackage: async (courseCode: string): Promise<{ success: boolean; packageId: string; manifest: string }> => {
        const response = await apiClient.post('/api/v1/lms/packages/compile', { courseCode });
        return response.data;
    },
    publishPackage: async (packageId: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post(`/api/v1/lms/packages/${packageId}/publish`);
        return response.data;
    },

    // Offline Submissions & Sync Ingestion
    getOfflineSubmissions: async (status?: string): Promise<OfflineSubmissionDto[]> => {
        const response = await apiClient.get('/api/v1/lms/sync/submissions', { params: { status } });
        return response.data;
    },
    gradeSubmission: async (submissionId: string, payload: { score: number; feedback: string }): Promise<OfflineSubmissionDto> => {
        const response = await apiClient.post(`/api/v1/lms/sync/submissions/${submissionId}/grade`, payload);
        return response.data;
    },
    syncOfflineAssignment: async (payload: any): Promise<{ submissionId: string }> => {
        const response = await apiClient.post('/api/v1/lms/sync/assignments', payload);
        return response.data;
    },
    syncOfflineAssessment: async (payload: any): Promise<{ submissionId: string }> => {
        const response = await apiClient.post('/api/v1/lms/sync/assessments', payload);
        return response.data;
    },

    // Gradebook Orchestration
    getGradebookRecords: async (courseCode?: string): Promise<GradebookRecordDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/gradebook', { params: { courseCode } });
        return response.data;
    },
    syncGradesToRegistrar: async (studentId: string, courseCode?: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post('/api/v1/academic/lms/gradebook/sync', { studentId, courseCode });
        return response.data;
    },
    batchSyncToRegistrar: async (studentIds: string[]): Promise<{ syncedCount: number }> => {
        const response = await apiClient.post('/api/v1/academic/lms/gradebook/sync-batch', { studentIds });
        return response.data;
    },

    // Assignments
    getAssignments: async (courseId?: string): Promise<AssignmentDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/assignments', { params: { courseId } });
        return response.data;
    },
    createAssignment: async (payload: Partial<AssignmentDto>): Promise<AssignmentDto> => {
        const response = await apiClient.post('/api/v1/academic/lms/assignments', payload);
        return response.data;
    },

    // Quizzes
    getQuizzes: async (courseId?: string): Promise<QuizDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/quizzes', { params: { courseId } });
        return response.data;
    },
    submitQuiz: async (quizId: string, payload: any): Promise<{ score: number; passed: boolean }> => {
        const response = await apiClient.post(`/api/v1/academic/lms/quizzes/${quizId}/submit`, payload);
        return response.data;
    },

    // Module Timeline
    getTimeline: async (courseCode?: string): Promise<ModuleTimelineItemDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/timeline', { params: { courseCode } });
        return response.data;
    },

    // Discussions, Calendar, Dashboard, Grades
    getDiscussions: async (courseId?: string): Promise<DiscussionPostDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/discussions', { params: { courseId } });
        return response.data;
    },
    createDiscussionPost: async (payload: Partial<DiscussionPostDto>): Promise<DiscussionPostDto> => {
        const response = await apiClient.post('/api/v1/academic/lms/discussions', payload);
        return response.data;
    },
    getCalendarEvents: async (month?: string): Promise<CalendarEventDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/calendar', { params: { month } });
        return response.data;
    },
    getDashboardOverview: async (): Promise<{ totalCourses: number; pendingSubmissions: number; activeQuizzes: number; syncedPackages: number }> => {
        const response = await apiClient.get('/api/v1/academic/lms/dashboard');
        return response.data;
    },
    getGrades: async (studentId?: string): Promise<GradebookRecordDto[]> => {
        const response = await apiClient.get('/api/v1/academic/lms/grades', { params: { studentId } });
        return response.data;
    }
};
