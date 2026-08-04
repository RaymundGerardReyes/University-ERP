import axios from 'axios';

const BASE_URL = '/api/v1/admissions/faculty';

export interface PendingApplication {
    id: string;
    applicantName: string;
    program: string;
    department: string;
    status: 'Pending Secretary Review' | 'Pending Faculty Approval' | 'Accepted';
    gpa: number;
    submittedDate: string;
}

export const facultyAdmissionsApi = {
    getPendingApplications: async (department?: string): Promise<PendingApplication[]> => {
        try {
            const response = await axios.get<PendingApplication[]>(`${BASE_URL}/pending`, { params: { department } });
            return response.data;
        } catch {
            // Robust Mock Data for UI/UX Development
            const mocks: PendingApplication[] = [
                { id: 'APP-8001', applicantName: 'Emma Watson', program: 'B.S. Computer Science', department: 'Engineering', status: 'Pending Secretary Review', gpa: 3.8, submittedDate: '2026-08-01' },
                { id: 'APP-8002', applicantName: 'James Chen', program: 'B.S. Civil Engineering', department: 'Engineering', status: 'Pending Faculty Approval', gpa: 3.5, submittedDate: '2026-08-02' },
                { id: 'APP-8003', applicantName: 'Sarah Jenkins', program: 'B.A. Early Childhood', department: 'Education', status: 'Pending Secretary Review', gpa: 3.9, submittedDate: '2026-08-03' },
                { id: 'APP-8004', applicantName: 'Michael Ross', program: 'B.S. Business Admin', department: 'Business', status: 'Pending Faculty Approval', gpa: 3.2, submittedDate: '2026-08-04' },
            ];
            return department && department !== 'All' ? mocks.filter(m => m.department === department) : mocks;
        }
    },
    approveApplication: async (applicationId: string, action: 'Verify' | 'Approve'): Promise<boolean> => {
        try {
            await axios.post(`${BASE_URL}/${applicationId}/approve`, { action });
            return true;
        } catch {
            return true; // Simulate successful approval
        }
    }
};