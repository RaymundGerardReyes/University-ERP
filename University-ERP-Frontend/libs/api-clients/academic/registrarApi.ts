import axios from 'axios';

const BASE_URL = '/api/v1/academic/registrar';

export const registrarApi = {
  // Admin Endpoints
  getAdmissionsQueue: async () => {
    const response = await axios.get(`${BASE_URL}/admissions/queue`);
    return response.data;
  },
  
  getEnrollmentValidationQueue: async () => {
    const response = await axios.get(`${BASE_URL}/enrollment/validation-queue`);
    return response.data;
  },
  
  getMasterStudents: async () => {
    const response = await axios.get(`${BASE_URL}/students/master-directory`);
    return response.data;
  },
  
  getOfficialGrades: async () => {
    const response = await axios.get(`${BASE_URL}/records/official-grades`);
    return response.data;
  },
  
  getSubjectCatalog: async () => {
    const response = await axios.get(`${BASE_URL}/curriculum/catalog`);
    return response.data;
  },
  
  getGraduationCandidates: async () => {
    const response = await axios.get(`${BASE_URL}/graduation/candidates`);
    return response.data;
  },
  
  getTranscriptRequests: async () => {
    const response = await axios.get(`${BASE_URL}/certifications/transcript-requests`);
    return response.data;
  },
  
  getStudentInquiries: async () => {
    const response = await axios.get(`${BASE_URL}/services/inquiries`);
    return response.data;
  },
  
  getCHEDReports: async () => {
    const response = await axios.get(`${BASE_URL}/compliance/ched-reports`);
    return response.data;
  },
  
  getAuditLogs: async () => {
    const response = await axios.get(`${BASE_URL}/security/audit-logs`);
    return response.data;
  },
  
  getPendingClearances: async () => {
    const response = await axios.get(`${BASE_URL}/clearances/pending`);
    return response.data;
  },
  
  evaluateClearance: async (studentId: string, criteria: any) => {
    const response = await axios.post(`${BASE_URL}/clearances/evaluate/${studentId}`, criteria);
    return response.data;
  },
  
  processTranscriptRequest: async (requestId: string, action: string) => {
    const response = await axios.post(`${BASE_URL}/certifications/transcript-requests/${requestId}/process`, { action });
    return response.data;
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
