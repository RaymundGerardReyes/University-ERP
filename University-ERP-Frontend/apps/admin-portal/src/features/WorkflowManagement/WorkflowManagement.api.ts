import { apiClient } from '@university-erp/api-clients';
import { WorkflowDto } from './WorkflowManagement.types';

export const fetchActiveWorkflows = async (): Promise<WorkflowDto[]> => {
    const response = await apiClient.get<WorkflowDto[]>('/governance/workflows/active');
    return response.data;
};