import { ApplicationStatusViewModel } from '@university-erp/domain-viewmodels';
import type { JourneyStateDto, ApplicantDocumentDto, TimelineEventDto } from '@university-erp/api-clients';

export interface ApplicantDashboardPageProps { }

export interface JourneyStep {
    stepName: string;
    isCompleted: boolean;
    dateCompleted?: string;
}

export type { ApplicationStatusViewModel, JourneyStateDto, ApplicantDocumentDto, TimelineEventDto };

