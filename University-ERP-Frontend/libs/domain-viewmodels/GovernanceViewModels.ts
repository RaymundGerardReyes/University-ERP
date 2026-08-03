export interface LogVisitorPayload {
  visitorName: string;
  purpose: string;
  hostId: string;
}

export interface LogVisitorResponse {
  logId: string;
  status: string;
}

export interface SubmitEvidencePayload {
  standardCode: string;
  submitterId: string;
  documentReference: string;
}

export interface SubmitEvidenceResponse {
  evidenceId: string;
  status: string;
}

export interface CreateTicketPayload {
  requesterId: string;
  category: string;
  issueDescription: string;
  priority: string;
}

export interface CreateTicketResponse {
  ticketId: string;
  status: string;
}

export interface SubmitGrievancePayload {
  complainantId: string;
  category: string;
  description: string;
}

export interface SubmitGrievanceResponse {
  complaintId: string;
  status: string;
}

export interface CreateEventPayload {
  eventName: string;
  organizerId: string;
  venue: string;
  scheduledDate: string;
  maxCapacity: number;
}

export interface CreateEventResponse {
  eventId: string;
  status: string;
}
