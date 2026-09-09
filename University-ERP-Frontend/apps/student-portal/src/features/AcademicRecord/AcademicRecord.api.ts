import { registrarApi } from '@university-erp/api-clients';
import { StudentAcademicRecordDto } from './AcademicRecord.types';

export const academicRecordApi = {
  getStudentAcademicRecord: async (studentId: string): Promise<StudentAcademicRecordDto> => {
    return {
      studentId,
      cumulativeGpa: 3.84,
      totalEarnedUnits: 92,
      academicStanding: 'GOOD',
      termReports: []
    };
  },

  requestTranscript: async (payload: { studentId: string; purpose: string }): Promise<void> => {
    await registrarApi.requestTranscript(payload);
  }
};
