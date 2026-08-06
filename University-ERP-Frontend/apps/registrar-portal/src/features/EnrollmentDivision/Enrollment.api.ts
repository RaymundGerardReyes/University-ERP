import { registrarApi } from '@university-erp/api-clients';
import { EnrollmentWorkflow } from '@university-erp/workflow-sdk';

export const fetchEnrollmentValidationQueue = async () => {
    return registrarApi.getEnrollmentValidationQueue();
};

export const validateEnrollment = async (studentId: string) => {
    return EnrollmentWorkflow.advance(studentId, 'SubjectValidation');
};
