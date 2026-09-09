import { lmsApi, CourseContentDto } from '@university-erp/api-clients';

export const courseContentApi = {
  getContent: async (sectionId: string): Promise<CourseContentDto> => {
    return await lmsApi.getCourseContent(sectionId);
  }
};
