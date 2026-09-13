import { JourneyStateDto, ProgramOfferingDto } from '@university-erp/api-clients';

export interface AdmissionOfferDto {
  applicationId: string;
  applicantName: string;
  program: ProgramOfferingDto | null;
  status: 'Offered' | 'Accepted' | 'Declined' | 'Pending';
  scholarshipDescription?: string;
  decisionDate?: string;
}

export interface RespondOfferPayload {
  applicationId: string;
  decision: 'Accepted' | 'Declined';
}

export type { JourneyStateDto };

