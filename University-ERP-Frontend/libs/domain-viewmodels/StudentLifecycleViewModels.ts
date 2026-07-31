export interface ApplicationStatusViewModel {
  id: string;
  programName: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Enrolled';
  submittedDate: string;
  missingDocuments: string[];
}

export interface RoomAllocationViewModel {
  id: string;
  hostelName: string;
  roomNumber: string;
  roomType: string;
  roommates: string[];
  status: 'Allocated' | 'Pending Request' | 'Vacated';
}

export interface HealthAppointmentViewModel {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface CounselingSessionViewModel {
  id: string;
  counselorName: string;
  sessionType: 'Academic' | 'Psychological' | 'Career';
  date: string;
  time: string;
  meetingLink: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface JobPostingViewModel {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  deadline: string;
  tags: string[];
}

export interface AlumniViewModel {
  id: string;
  graduationYear: string;
  alumniStatus: 'Pending Clearance' | 'Registered' | 'Active Member';
  chapter: string | null;
  benefitsActive: boolean;
}
