export interface CalendarEventDto {
  id: string;
  title: string;
  date: string;
  type: 'Assignment' | 'Quiz' | 'Lecture' | 'Exam';
  courseCode: string;
}
