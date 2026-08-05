import { admissionsApi } from '@university-erp/api-clients';

export const fetchApplicationTimeline = async (studentId: string) => {
    return admissionsApi.getApplicantJourney(studentId);
};