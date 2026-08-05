import { hrApi } from '@university-erp/api-clients';
import { OnboardEmployeePayload } from '@university-erp/domain-viewmodels';

export const onboardNewEmployee = async (payload: OnboardEmployeePayload) => {
    return hrApi.onboardEmployee(payload);
};

// Replace mock fetch with live hrApi call
export const fetchActiveEmployees = async () => {
    return (hrApi as any).getActiveEmployees?.() ?? [];
};