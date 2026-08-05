import axios from 'axios';
import { 
  LogVisitorPayload, LogVisitorResponse, 
  SubmitEvidencePayload, SubmitEvidenceResponse,
  CreateTicketPayload, CreateTicketResponse,
  SubmitGrievancePayload, SubmitGrievanceResponse,
  CreateEventPayload, CreateEventResponse
} from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/governance';

export const governanceApi = {
  logVisitor: async (payload: LogVisitorPayload): Promise<LogVisitorResponse> => {
    try {
      const response = await axios.post<LogVisitorResponse>(`${BASE_URL}/visitors`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  submitEvidence: async (payload: SubmitEvidencePayload): Promise<SubmitEvidenceResponse> => {
    try {
      const response = await axios.post<SubmitEvidenceResponse>(`${BASE_URL}/accreditation/evidence`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createTicket: async (payload: CreateTicketPayload): Promise<CreateTicketResponse> => {
    try {
      const response = await axios.post<CreateTicketResponse>(`${BASE_URL}/tickets`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  submitGrievance: async (payload: SubmitGrievancePayload): Promise<SubmitGrievanceResponse> => {
    try {
      const response = await axios.post<SubmitGrievanceResponse>(`${BASE_URL}/grievances`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (payload: CreateEventPayload): Promise<CreateEventResponse> => {
    try {
      const response = await axios.post<CreateEventResponse>(`${BASE_URL}/events`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
