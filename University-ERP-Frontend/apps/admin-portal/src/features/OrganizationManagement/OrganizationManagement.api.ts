import axios from 'axios';
import { OrgNodeDto } from './OrganizationManagement.types';

export const fetchOrganizationHierarchy = async (): Promise<OrgNodeDto[]> => {
    // Calls the MultiCampus endpoint you created in the .NET backend
    const response = await axios.get('/api/v1/platform/multicampus/organization/hierarchy');
    return response.data;
};