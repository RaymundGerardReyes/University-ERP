export interface CreateAssignmentPayload {
  title: string;
  instructions: string;
  courseId: string;
  dueDate: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  instructions: string;
  courseId: string;
  dueDate: string;
  status: 'Published' | 'Draft';
}
