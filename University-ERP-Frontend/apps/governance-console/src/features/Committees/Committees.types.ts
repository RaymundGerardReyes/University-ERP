export interface Committee {
  id: string;
  name: string;
  chairperson: string;
  membersCount: number;
  meetingFrequency: string;
  nextMeetingDate: string;
  standing: 'Active' | 'Recessed' | 'AdHoc';
}
