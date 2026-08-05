import { communicationApi, teachingApi } from '@university-erp/api-clients';

export const fetchFacultyDashboardData = async (facultyId: string) => {
    const [courses, inbox] = await Promise.all([
        teachingApi.getMyCourses(facultyId),
        communicationApi.getInbox(facultyId)
    ]);

    return { courses, inbox };
};