import { CreateAssignmentPayload, AssignmentItem } from './Assignments.types';

import { env } from '../../config/env';

export const assignmentsApi = {
  createAssignment: async (payload: CreateAssignmentPayload): Promise<AssignmentItem> => {
    // Calls .NET 10 Modular Monolith Backend API
    const response = await fetch(`${env.API_BASE_URL}/academic/lms/assignments`, {
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
