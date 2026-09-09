import { lmsApi, ModuleTimelineItemDto } from '@university-erp/api-clients';

export const moduleTimelineApi = {
  getTimeline: async (courseCode?: string): Promise<ModuleTimelineItemDto[]> => {
    return await lmsApi.getTimeline(courseCode);
  }
};
