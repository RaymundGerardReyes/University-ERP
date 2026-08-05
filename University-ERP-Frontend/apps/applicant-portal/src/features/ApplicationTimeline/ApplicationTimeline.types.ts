export interface ApplicationTimelinePageProps { }

export interface JourneyStep {
    id: string;
    stepName: string;
    description: string;
    status: 'Completed' | 'Current' | 'Pending';
    completedDate?: string;
}