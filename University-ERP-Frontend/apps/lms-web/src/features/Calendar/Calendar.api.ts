import { lmsApi } from '@university-erp/api-clients';

export const calendarApi = {
  getEvents: async (month?: string) => {
    return await lmsApi.getCalendarEvents(month);
  }
};
