import { apiClient } from '@university-erp/api-clients';
import {
    AddDropRequestDto,
    RegistrationExceptionDto,
    RegistrationRequestDto,
    RegistrationWindowDto,
    WaitlistEntryDto
} from './Enrollment.types';

const BASE_URL = '/api/registrar/enrollment';

export const enrollmentApi = {
    getWindows: async (): Promise<RegistrationWindowDto[]> => (await apiClient.get(`${BASE_URL}/windows`)).data,
    getRequests: async (): Promise<RegistrationRequestDto[]> => (await apiClient.get(`${BASE_URL}/requests`)).data,
    getAddDropRequests: async (): Promise<AddDropRequestDto[]> => (await apiClient.get(`${BASE_URL}/add-drop`)).data,
    getWaitlists: async (): Promise<WaitlistEntryDto[]> => (await apiClient.get(`${BASE_URL}/waitlists`)).data,
    getExceptions: async (): Promise<RegistrationExceptionDto[]> => (await apiClient.get(`${BASE_URL}/exceptions`)).data,

    processException: async (exceptionId: string, action: 'APPROVED' | 'REJECTED') => {
        const response = await apiClient.post(`${BASE_URL}/exceptions/${exceptionId}/process`, { action });
        return response.data;
    }
};