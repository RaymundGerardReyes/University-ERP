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
        } catch (error) {
            throw error;
        }
    },
    approveApplication: async (applicationId: string, action: 'Verify' | 'Approve'): Promise<boolean> => {
        try {
            await axios.post(`${BASE_URL}/${applicationId}/approve`, { action });
            return true;
        } catch (error) {
            throw error;
        }
    }
};