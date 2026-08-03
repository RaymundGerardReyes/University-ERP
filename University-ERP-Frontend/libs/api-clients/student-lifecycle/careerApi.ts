import axios from 'axios';
import { JobPostingViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/career';

export const careerApi = {
  getJobPostings: async (): Promise<JobPostingViewModel[]> => {
    try {
      const response = await axios.get<JobPostingViewModel[]>(`${BASE_URL}/jobs`);
      return response.data;
    } catch {
      return [
        {
          id: 'JOB-301',
          jobTitle: 'Graduate Software Engineer',
          companyName: 'Nexus Tech Corp',
          location: 'San Francisco, CA / Remote',
          tags: ['Full-Time', 'React', '.NET Core'],
          deadline: '2026-08-30T23:59:59Z'
        }
      ];
    }
  }
};
