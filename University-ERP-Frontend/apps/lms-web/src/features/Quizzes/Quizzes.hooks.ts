import { useQuery } from '@tanstack/react-query';
import { quizzesApi } from './Quizzes.api';

export function useQuizzes(courseId?: string) {
  return useQuery({
    queryKey: ['lmsQuizzes', courseId],
    queryFn: () => quizzesApi.getQuizzes(courseId)
  });
}
