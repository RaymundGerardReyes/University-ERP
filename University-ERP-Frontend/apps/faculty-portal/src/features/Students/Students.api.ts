import { facultyStudentsApi } from '@university-erp/api-clients';

export const fetchMyStudents = async (facultyId: string) => {
  return facultyStudentsApi.getMyStudents(facultyId);
};