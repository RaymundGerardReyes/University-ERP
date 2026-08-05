import { teachingApi } from '@university-erp/api-clients';

export const fetchMyCourses = async (facultyId: string) => {
    return teachingApi.getMyCourses(facultyId);
};

export const logAttendance = async (sectionId: string, attendanceData: any) => {
    return teachingApi.submitAttendance(sectionId, attendanceData);
};