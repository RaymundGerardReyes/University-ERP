import { lmsApi } from '@university-erp/api-clients';

export const discussionsApi = {
  getDiscussions: async (courseId?: string) => {
    return await lmsApi.getDiscussions(courseId);
  }
};
