import { apiClient } from '@university-erp/api-clients';
import { RegistrationDto, SubmitRegistrationRequest, WaitlistEntry } from './Registration.types';

export const registrationApi = {
    // Removed leading '/api/' so it correctly appends to the Axios baseURL '/api/v1/'
    getCurrentRegistration: async (studentId: string, termId: string): Promise<RegistrationDto> => {
        const response = await apiClient.get(`student/${studentId}/registration/current?termId=${termId}`);
        return response.data;
    },

    submitRegistration: async (request: SubmitRegistrationRequest): Promise<RegistrationDto> => {
        const response = await apiClient.post('student/registration/submit', request);
        return response.data;
    },
    
    browseCourses: async (termId: string, filters?: Record<string, any>) => {
        const response = await apiClient.get(`curriculum/courses?termId=${termId}`, { params: filters });
        return response.data;
    },
    
    addCourse: async (studentId: string, sectionId: string, termId: string) => {
        const response = await apiClient.post(`student/${studentId}/registration/add`, { sectionId, termId });
        return response.data;
    },
    
    dropCourse: async (studentId: string, registrationLineItemId: string, reason?: string) => {
        const response = await apiClient.post(`student/${studentId}/registration/drop`, { registrationLineItemId, reason });
        return response.data;
    },
    
    swapSection: async (studentId: string, fromSectionId: string, toSectionId: string) => {
        const response = await apiClient.post(`student/${studentId}/registration/swap`, { fromSectionId, toSectionId });
        return response.data;
    },

    joinWaitlist: async (studentId: string, sectionId: string): Promise<WaitlistEntry> => {
        const response = await apiClient.post(`student/${studentId}/waitlist/join`, { sectionId });
        return response.data;
    },

    getWaitlistPosition: async (studentId: string, sectionId: string): Promise<number> => {
        const response = await apiClient.get(`student/${studentId}/waitlist/${sectionId}/position`);
        return response.data.position;
    }
};