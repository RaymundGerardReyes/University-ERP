import { useQuery } from '@tanstack/react-query';
import { fetchActiveWorkflows } from './WorkflowManagement.api';

export const useActiveWorkflows = () => {
    return useQuery({
        queryKey: ['activeWorkflows'],
        queryFn: fetchActiveWorkflows,
    });
};