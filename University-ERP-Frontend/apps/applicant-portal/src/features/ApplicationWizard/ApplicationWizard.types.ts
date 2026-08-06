export interface ApplicationWizardPageProps { }

export interface ApplicationFormData {
    applicantId?: string;
    programId: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    previousSchool: string;
    gpa: string;
}