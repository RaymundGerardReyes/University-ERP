import { JobPostingViewModel } from '@university-erp/domain-viewmodels';

export const careerApi = {
  getJobPostings: async (): Promise<JobPostingViewModel[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([
      {
        id: 'JOB-2024-001',
        companyName: 'TechNova Solutions',
        jobTitle: 'Junior Software Engineer',
        location: 'Remote',
        deadline: '2023-12-01',
        tags: ['Frontend', 'React', 'Full-time']
      },
      {
        id: 'JOB-2024-002',
        companyName: 'Global Finance Corp',
        jobTitle: 'Data Analyst Intern',
        location: 'New York, NY',
        deadline: '2023-11-20',
        tags: ['Data', 'Python', 'Internship']
      }
    ]), 400));
  }
};
