import axios from 'axios';
import { JobPostingViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/career';

export const careerApi = {
  getJobPostings: async (): Promise<JobPostingViewModel[]> => {
    try {
      const response = await axios.get<JobPostingViewModel[]>(`${BASE_URL}/jobs`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
