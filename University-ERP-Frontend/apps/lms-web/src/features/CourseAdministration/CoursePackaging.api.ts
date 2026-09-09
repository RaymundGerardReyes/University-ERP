import { lmsApi, CoursePackageDto } from '@university-erp/api-clients';
import { CompilePackagePayload } from './CoursePackaging.types';

export const coursePackagingApi = {
  getPackages: async (): Promise<CoursePackageDto[]> => {
    return await lmsApi.getPackages();
  },
  compilePackage: async (courseCode: string): Promise<{ success: boolean; packageId: string; manifest: string }> => {
    return await lmsApi.compilePackage(courseCode);
  },
  publishPackage: async (packageId: string): Promise<{ success: boolean }> => {
    return await lmsApi.publishPackage(packageId);
  }
};
