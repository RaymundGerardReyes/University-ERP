export interface EligibilityCheckerPageProps { }

export interface EligibilityPayload {
    programId: string;
    gpa: number;
    previousDegree: string;
}

export interface EligibilityResponse {
    isEligible: boolean;
    message: string;
    missingPrerequisites?: string[];
}