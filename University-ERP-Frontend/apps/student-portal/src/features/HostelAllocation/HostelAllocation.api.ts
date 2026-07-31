import { hostelApi } from '@university-erp/api-clients';

export const fetchHostelAllocation = async (studentId: string) => {
  return hostelApi.getAllocation(studentId);
};
