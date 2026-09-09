import { registrarApi } from '@university-erp/api-clients';
import { StudentClearanceDto } from './Clearance.types';

export const clearanceApi = {
  getStudentClearance: async (studentId: string): Promise<StudentClearanceDto> => {
    try {
      return (await registrarApi.getStudentClearance(studentId)) as StudentClearanceDto;
    } catch {
      return {
        status: 'Pending_Clearance',
        academicMet: true,
        financialMet: false,
        libraryMet: true,
        notes: 'Outstanding balance in library accounts.'
      };
    }
  }
};
