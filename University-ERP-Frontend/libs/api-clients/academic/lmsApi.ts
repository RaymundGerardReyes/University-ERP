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

export const lmsApi = {
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
    }
};
