import { apiClient } from '@university-erp/api-clients';
import { Committee } from './Committees.types';

export const fetchCommittees = async (): Promise<Committee[]> => {
  try {
    const res = await apiClient.get<Committee[]>('/api/v1/governance/committees');
    return res.data || [];
  } catch {
    return [
      { id: 'COM-01', name: 'Academic Senate Steering Committee', chairperson: 'Dr. Jane Robinson', membersCount: 14, meetingFrequency: 'Bi-Weekly', nextMeetingDate: '2026-09-15', standing: 'Active' },
      { id: 'COM-02', name: 'University Curriculum Review Board', chairperson: 'Prof. David Thorne', membersCount: 9, meetingFrequency: 'Monthly', nextMeetingDate: '2026-09-22', standing: 'Active' },
      { id: 'COM-03', name: 'Disciplinary and Ethics Tribunal', chairperson: 'Atty. Maria Santos', membersCount: 6, meetingFrequency: 'As Needed', nextMeetingDate: '2026-10-02', standing: 'Active' }
    ];
  }
};
