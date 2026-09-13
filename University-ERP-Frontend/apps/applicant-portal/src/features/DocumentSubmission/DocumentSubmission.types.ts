import { ApplicantDocumentDto, JourneyStateDto } from '@university-erp/api-clients';

export type ApplicantDocumentItem = ApplicantDocumentDto;

export interface UploadDocumentPayload {
  applicationId: string;
  documentName: string;
  filePath: string;
}

export interface DocumentPreviewState {
  isOpen: boolean;
  name: string;
  url: string;
  mimeType: string;
}

export type { JourneyStateDto };