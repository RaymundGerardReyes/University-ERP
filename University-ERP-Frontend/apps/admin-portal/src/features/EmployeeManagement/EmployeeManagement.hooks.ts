import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OnboardEmployeePayload } from '@university-erp/domain-viewmodels';
import { fetchActiveEmployees, onboardNewEmployee } from './EmployeeManagement.api';

export const useActiveEmployees = () => {
    return useQuery({
        queryKey: ['activeEmployees'],
        queryFn: fetchActiveEmployees,
    });
};

export const useOnboardEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: OnboardEmployeePayload) => onboardNewEmployee(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeEmployees'] });
        }
    });
};