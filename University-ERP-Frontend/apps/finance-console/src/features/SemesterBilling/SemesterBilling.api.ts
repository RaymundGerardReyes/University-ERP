import { apiClient } from '@university-erp/api-clients';
import { InvoiceDto, SemesterAssessmentDto } from './SemesterBilling.types';
import { toSafeArray } from '../../utils/arrayUtils';

const BASE_URL = '/finance/semester-billing';

export const semesterBillingApi = {
  getPendingAssessments: async (termId: string): Promise<SemesterAssessmentDto[]> => {
    const response = await apiClient.get<SemesterAssessmentDto[]>(`${BASE_URL}/assessments/pending`, { params: { termId } });
    return toSafeArray<SemesterAssessmentDto>(response.data);
  },

  finalizeAssessment: async (assessmentId: string): Promise<InvoiceDto> => {
    const response = await apiClient.post<InvoiceDto>(`${BASE_URL}/assessments/${assessmentId}/finalize`);
    return response.data;
  },

  getTermInvoices: async (termId: string): Promise<InvoiceDto[]> => {
    const response = await apiClient.get<InvoiceDto[]>(`${BASE_URL}/invoices`, { params: { termId } });
    return toSafeArray<InvoiceDto>(response.data);
  },
};