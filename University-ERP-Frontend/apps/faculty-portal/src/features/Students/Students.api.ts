import { apiClient } from '@university-erp/api-clients';
import { SectionRosterDto } from './Students.types';

const BASE_URL = '/academic/teaching';

export const studentsApi = {
  // REPLACED: Global student fetch (getMyStudents) removed to enforce section-scoping.

  // NEW: Strictly scoped section roster fetch
  getSectionRoster: async (sectionId: string): Promise<SectionRosterDto> => {
    const response = await apiClient.get<SectionRosterDto>(`${BASE_URL}/sections/${sectionId}/roster`);
    return response.data;
  }
};