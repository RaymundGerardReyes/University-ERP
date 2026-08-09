import { CreateAssignmentPayload, AssignmentItem } from './Assignments.types';

export const assignmentsApi = {
  createAssignment: async (payload: CreateAssignmentPayload): Promise<AssignmentItem> => {
    // Calls .NET 10 Modular Monolith Backend API
    const response = await fetch('http://localhost:5000/api/v1/academic/lms/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create assignment: ${response.statusText}`);
    }

    return await response.json();
  }
};
