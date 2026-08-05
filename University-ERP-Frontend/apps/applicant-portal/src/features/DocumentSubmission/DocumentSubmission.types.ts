export interface DocumentSubmissionPageProps { }

export interface RequiredDocument {
    id: string;
    name: string;
    status: 'Pending' | 'Uploaded' | 'Rejected';
    description: string;
}