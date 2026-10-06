import { apiClient } from '@university-erp/api-clients';
import { OrgNodeDto } from './OrganizationManagement.types';

export const fetchOrganizationHierarchy = async (): Promise<OrgNodeDto[]> => {
    // Calls the MultiCampus endpoint in the .NET backend
    const response = await apiClient.get<OrgNodeDto[]>('/platform/multicampus/organization/hierarchy');
    return response.data;
};