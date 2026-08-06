import axios from 'axios';

const BASE_URL = '/api/v1/academic/registrar';

export const registrarApi = {
  // Admin Endpoints
  getAdmissionsQueue: async () => {
    // Mock data for UI development
    return [
      { id: 'APP-2026-005', applicantName: 'Michael Chen', program: 'BS Engineering', status: 'Pending Interview' }
    ];
  },
  getEnrollmentValidationQueue: async () => {
    return [
      { id: 'STU-2025-1024', studentName: 'Sarah Jenkins', units: 21, status: 'Subject Loaded' }
    ];
  },
  getMasterStudents: async () => {
    return [
      { id: 'STU-2024-0012', name: 'Alex Mercer', program: 'BS Computer Science', year: '3rd Year', status: 'Active' }
    ];
  },
  getOfficialGrades: async () => {
    return [
      { section: 'CS101-A', subject: 'Intro to Programming', faculty: 'Dr. Alan Turing', status: 'Submitted' }
    ];
  },
  getSubjectCatalog: async () => {
    return [
      { code: 'CS201', title: 'Data Structures and Algorithms', units: 3.0, prerequisites: 'CS102', status: 'Active' }
    ];
  },
  getGraduationCandidates: async () => {
    return [
      { id: 'STU-2022-0491', name: 'Emma Watson', program: 'BA Literature', gpa: 1.25, status: 'Pending Clearance' }
    ];
  },
  getTranscriptRequests: async () => {
    return [
      { id: 'REQ-8831', requester: 'David Miller', type: 'Official TOR', purpose: 'Employment Verification', status: 'Processing' }
    ];
  },
  getStudentInquiries: async () => {
    return [
      { id: 'TCK-9012', student: 'Liam Johnson', category: 'Data Correction (Birthdate)', priority: 'High', status: 'Open' }
    ];
  },
  getCHEDReports: async () => {
    return [];
  },
  getAuditLogs: async () => {
    return [
      { timestamp: '2026-08-05 14:22:11', actor: 'reg_admin_01', action: 'GRADE_MODIFICATION', target: 'STU-2023-9182', ip: '192.168.1.45' },
      { timestamp: '2026-08-05 13:10:05', actor: 'reg_staff_12', action: 'TOR_VIEWED', target: 'STU-2021-0044', ip: '192.168.1.102' }
    ];
  },
  getPendingClearances: async () => {
    const response = await axios.get(`${BASE_URL}/clearances/pending`);
    return response.data;
  },
  evaluateClearance: async (studentId: string, criteria: any) => {
    return Promise.resolve({ success: true, studentId, criteria });
  },
  processTranscriptRequest: async (requestId: string, action: string) => {
    return Promise.resolve({ success: true, requestId, action });
  },
  
  // Student Endpoints
  registerCourse: async (payload: { studentId: string, courseCode: string, academicTerm: string }) => {
    const response = await axios.post(`${BASE_URL}/register`, payload);
    return response.data;
  },
  requestTranscript: async (payload: { studentId: string, purpose: string }) => {
    const response = await axios.post(`${BASE_URL}/transcripts/request`, payload);
    return response.data;
  },
  getStudentClearance: async (studentId: string) => {
    const response = await axios.get(`${BASE_URL}/clearances/student/${studentId}`);
    return response.data;
  }
};
