export interface ModuleTimelineItemDto {
  id: string;
  title: string;
  type: 'Lesson' | 'Assignment' | 'Quiz';
  status: 'Active' | 'Completed' | 'Locked' | 'Pending';
  due?: string;
}

export interface CourseTimelineDto {
  code: string;
  title: string;
  faculty: string;
  modules: ModuleTimelineItemDto[];
}
