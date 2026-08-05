import { admissionsApi } from '@university-erp/api-clients';

export const fetchApplicantDashboard = async (studentId: string) => {
    const [status, journey] = await Promise.all([
        admissionsApi.getApplicationStatus(studentId),
        admissionsApi.getApplicantJourney(studentId)
    ]);
    return { status, journey };
};