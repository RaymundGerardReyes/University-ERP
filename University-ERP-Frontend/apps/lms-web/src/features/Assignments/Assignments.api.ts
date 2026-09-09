import { lmsApi, AssignmentDto } from '@university-erp/api-clients';
import { CreateAssignmentPayload, AssignmentItem } from './Assignments.types';

export const assignmentsApi = {
  getAssignments: async (courseId?: string): Promise<AssignmentDto[]> => {
    return await lmsApi.getAssignments(courseId);
  },
  createAssignment: async (payload: CreateAssignmentPayload): Promise<AssignmentItem> => {
    const created = await lmsApi.createAssignment(payload);
    return {
      id: created.id || 'ASN-' + Date.now(),
      title: created.title,
      instructions: created.instructions,
      courseId: created.courseId,
      dueDate: created.dueDate,
      status: (created.status === 'Published' || created.status === 'Draft') ? created.status : 'Published'
    };
  }
};
