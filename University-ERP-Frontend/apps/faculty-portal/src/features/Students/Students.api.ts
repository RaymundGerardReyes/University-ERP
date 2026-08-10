import axios from 'axios';
import { SectionRosterDto } from './Students.types';

const BASE_URL = '/api/v1/academic/teaching';

export const studentsApi = {
  // REPLACED: Global student fetch (getMyStudents) removed to enforce section-scoping.

  // NEW: Strictly scoped section roster fetch
  getSectionRoster: async (sectionId: string): Promise<SectionRosterDto> => {
    const response = await axios.get<SectionRosterDto>(`${BASE_URL}/sections/${sectionId}/roster`);
    return response.data;
  }
};