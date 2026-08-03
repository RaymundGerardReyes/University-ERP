import { hostelApi } from '@university-erp/api-clients';
export const fetchHostelAllocation = async (studentId) => {
    return hostelApi.getAllocation(studentId);
};
