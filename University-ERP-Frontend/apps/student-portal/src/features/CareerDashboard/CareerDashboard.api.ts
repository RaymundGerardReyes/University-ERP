import { careerApi } from '@university-erp/api-clients';

export const fetchJobPostings = async () => {
  return careerApi.getJobPostings();
};
