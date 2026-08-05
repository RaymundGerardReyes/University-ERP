import { ApplicationStatusViewModel } from '@university-erp/domain-viewmodels';

export interface ApplicantDashboardPageProps { }

export interface JourneyStep {
    stepName: string;
    isCompleted: boolean;
    dateCompleted?: string;
}

export type { ApplicationStatusViewModel };
