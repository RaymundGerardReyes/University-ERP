import { createLogger } from '@university-erp/core-logger';
import { financePaymentSessionApi } from '@university-erp/api-clients';

const logger = createLogger('workflow-sdk', 'FinanceWorkflow');

export type FinanceAction = 'GenerateBilling' | 'AssessTuition' | 'ApplyScholarship' | 'ClearBalance' | 'ReconcilePayment';

export class FinanceWorkflow {
  static async process(studentId: string, action: FinanceAction, metadata?: any): Promise<any> {
    logger.info(`Processing finance action ${action} for student ${studentId}`);
    
    try {
      if (action === 'ReconcilePayment') {
        if (!metadata?.sessionId || !metadata?.cashierId) {
            throw new Error('Session ID and Cashier ID are required for manual reconciliation.');
        }
        
        const response = await financePaymentSessionApi.reconcileSession(metadata.sessionId, {
            cashierId: metadata.cashierId,
            remarks: metadata.remarks || 'Manual reconciliation via Finance Console'
        });
        
        return { success: true, action, data: response };
      }

      return Promise.resolve({ success: true, action });
      
    } catch (error) {
      logger.error(`Failed to process finance action: ${action}`, error);
      throw error;
    }
  }
}

