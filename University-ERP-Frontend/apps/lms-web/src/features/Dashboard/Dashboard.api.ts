import { lmsApi } from '@university-erp/api-clients';

export const dashboardApi = {
  getOverview: async () => {
    return await lmsApi.getDashboardOverview();
  }
};
