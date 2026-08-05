import { OnboardEmployeePayload, OnboardEmployeeResponse } from '@university-erp/domain-viewmodels';

export interface EmployeeManagementPageProps { }

export interface EmployeeRecord {
    id: string;
    name: string;
    role: string;
    department: string;
    status: 'Active' | 'On Leave' | 'Terminated';
}

export type { OnboardEmployeePayload, OnboardEmployeeResponse };
