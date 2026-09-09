import { lmsApi, QuizDto } from '@university-erp/api-clients';

export const quizzesApi = {
  getQuizzes: async (courseId?: string): Promise<QuizDto[]> => {
    return await lmsApi.getQuizzes(courseId);
  }
};
