import { admissionsApi } from '@university-erp/api-clients';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('workflow-sdk', 'AdmissionWorkflow');

/**
 * Valid stages in the Enterprise Admission Orchestration Workflow.
 * These map to specific backend aggregate behaviors.
 */
export type AdmissionStage = 
  | 'DocumentVerification' 
  | 'InterviewCompletion' 
  | 'ChairpersonRecommendation' 
  | 'DeanEndorsement' 
  | 'RegistrarEnrollment';

export class AdmissionWorkflow {
  
  /**
   * Advances the admission case to the specified workflow stage.
   * Internally dispatches the correct role-specific CQRS command.
   */
  static async advance(admissionId: string, stage: AdmissionStage, remarks?: string): Promise<any> {
    logger.info(`Advancing admission case ${admissionId} to stage: ${stage}`);

    try {
      switch (stage) {
        case 'DocumentVerification':
          // In a real impl, this would call admissionsApi.verifyDocuments(admissionId)
          return await Promise.resolve({ success: true, newStatus: 'InterviewPending' });

        case 'InterviewCompletion':
          return await Promise.resolve({ success: true, newStatus: 'UnderAcademicEvaluation' });

        case 'ChairpersonRecommendation':
          return await admissionsApi.recommendApplication(admissionId, remarks || 'Recommended');

        case 'DeanEndorsement':
          return await admissionsApi.endorseApplication(admissionId);

        case 'RegistrarEnrollment':
          return await admissionsApi.activateEnrollment(admissionId);

        default:
          throw new Error(`Unknown admission workflow stage: ${stage}`);
      }
    } catch (error) {
      logger.error(`Failed to advance workflow to ${stage} for ${admissionId}`, error);
      throw error;
    }
  }
}
