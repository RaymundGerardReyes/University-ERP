import { lmsApi, GradebookRecordDto } from '@university-erp/api-clients';

export const gradebookSyncApi = {
  getRecords: async (courseCode?: string): Promise<GradebookRecordDto[]> => {
    return await lmsApi.getGradebookRecords(courseCode);
  },
  syncToRegistrar: async (studentId: string, courseCode?: string): Promise<{ success: boolean }> => {
    return await lmsApi.syncGradesToRegistrar(studentId, courseCode);
  },
  batchSync: async (studentIds: string[]): Promise<{ syncedCount: number }> => {
    return await lmsApi.batchSyncToRegistrar(studentIds);
  }
};
