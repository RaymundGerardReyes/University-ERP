import { ApplicationStatusViewModel } from '@university-erp/domain-viewmodels';
import axios from 'axios';

const BASE_URL = '/api/v1/admissions';

// Exact mappings to C# DTOs
export interface ApplicantDocumentDto {
  id: string;
  name: string;
  status: string;
  uploadedAt?: string | null;
  feedback?: string | null;
  filePath?: string | null;
}

export interface TimelineEventDto {
  date: string;
  event: string;
  detail: string;
}

export interface JourneyMilestoneDto {
  id: string;
  title: string;
  status: string;
  description: string;
  dateCompleted?: string | null;
}

export interface ProgramOfferingDto {
  id: string;
  college: string;
  degree: string;
  major: string;
  duration: string;
  intake: string;
  tuitionEstimate: string;
  tags: string[];
}

export interface JourneyStateDto {
  applicantName: string;
  applicantId: string;
  currentStage: number;
  applicationFeeStatus: string; // NEW
  milestones: JourneyMilestoneDto[];
  programs: ProgramOfferingDto[];
  documents: ApplicantDocumentDto[];
  timeline: TimelineEventDto[];
}

export interface PendingApplicationDto {
  id: string;
  applicantName: string;
  program: string;
  department: string;
  status: string;
  gpa: number;
  submittedDate: string;
  interviewDate?: string | null; // NEW
  interviewTime?: string | null; // NEW
  applicationFeeStatus: string; // NEW
  documents: ApplicantDocumentDto[]; // NEW
}

export const admissionsApi = {
  getApplicationsByStage: async (stage: 'SecretaryQueue' | 'ChairpersonQueue' | 'RegistrarQueue') => {
    const response = await axios.get(`${BASE_URL}/queue`, { params: { stage } });
    return response.data;
  },

  getPendingApplications: async (department?: string): Promise<PendingApplicationDto[]> => {
    const response = await axios.get<PendingApplicationDto[]>(`${BASE_URL}/faculty/pending`, { params: { department } });
    return response.data;
  },

  recommendApplication: async (applicationId: string, remarks: string) => {
    const response = await axios.post(`${BASE_URL}/faculty/${applicationId}/approve`, { action: 'Recommend', notes: remarks });
    return response.data;
  },

  endorseApplication: async (applicationId: string) => {
    const response = await axios.post(`${BASE_URL}/faculty/${applicationId}/approve`, { action: 'Endorse' });
    return response.data;
  },

  activateEnrollment: async (applicationId: string) => {
    const response = await axios.post(`${BASE_URL}/faculty/${applicationId}/approve`, { action: 'Activate' });
    return response.data;
  },

  verifyDocumentsAndForward: async (applicationId: string) => {
    const response = await axios.post(`${BASE_URL}/${applicationId}/verify-and-forward`);
    return response.data;
  },

  submitAcademicEvaluation: async (applicationId: string, decision: 'Accept' | 'Reject' | 'Waitlist', notes: string) => {
    const response = await axios.post(`${BASE_URL}/${applicationId}/evaluate`, { decision, notes });
    return response.data;
  },

  generateStudentIdentityAndEnroll: async (applicationId: string) => {
    const response = await axios.post(`${BASE_URL}/${applicationId}/enroll`);
    return response.data;
  },

  getApplicationStatus: async (studentId: string): Promise<ApplicationStatusViewModel[]> => {
    const response = await axios.get<ApplicationStatusViewModel[]>(`${BASE_URL}/status/${studentId}`);
    return response.data;
  },

  getApplicantJourney: async (studentId: string): Promise<JourneyStateDto> => {
    const response = await axios.get<JourneyStateDto>(`${BASE_URL}/applications/journey/${studentId}`);
    return response.data;
  },

  submitApplication: async (data: any): Promise<string> => {
    const response = await axios.post(`${BASE_URL}/applications`, data);
    return response.data;
  },

  uploadDocument: async (applicationId: string, data: { documentName: string, filePath: string }): Promise<boolean> => {
    const response = await axios.post(`${BASE_URL}/applications/${applicationId}/documents`, data);
    return response.data;
  },

  getProgramCatalog: async (): Promise<ProgramOfferingDto[]> => {
    const response = await axios.get<ProgramOfferingDto[]>(`${BASE_URL}/programs`);
    return response.data;
  },

  checkEligibility: async (data: any): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/eligibility`, data);
    return response.data;
  },

  // --- NEW METHOD ---
  scheduleInterview: async (applicationId: string, payload: { date: string, time: string }): Promise<void> => {
    await axios.post(`${BASE_URL}/applications/${applicationId}/schedule-interview`, payload);
  }
};