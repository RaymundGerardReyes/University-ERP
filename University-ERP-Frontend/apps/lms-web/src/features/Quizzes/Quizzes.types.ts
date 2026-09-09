export interface QuizDto {
  id: string;
  courseId: string;
  title: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  status: 'Available' | 'Locked' | 'Completed';
}
