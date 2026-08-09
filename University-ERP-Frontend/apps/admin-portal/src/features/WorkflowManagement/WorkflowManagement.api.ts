import axios from 'axios';
import { WorkflowDto } from './WorkflowManagement.types';

export const fetchActiveWorkflows = async (): Promise<WorkflowDto[]> => {
    const response = await axios.get('/api/v1/governance/workflows/active');
    return response.data;
};