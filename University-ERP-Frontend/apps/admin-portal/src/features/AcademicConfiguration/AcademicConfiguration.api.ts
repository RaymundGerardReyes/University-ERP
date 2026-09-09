import { apiClient } from '@university-erp/api-clients';
import { AcademicConfigDto, UpdateAcademicConfigPayload } from './AcademicConfiguration.types';

export const fetchAcademicConfig = async (): Promise<AcademicConfigDto> => {
    const res = await apiClient.get('/api/v1/academic/configuration');
    return res.data;
};

export const updateAcademicConfig = async (payload: UpdateAcademicConfigPayload): Promise<{ success: boolean }> => {
    const res = await apiClient.post('/api/v1/academic/configuration', payload);
    return res.data;
};

