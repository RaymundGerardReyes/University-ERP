import { apiClient } from '@university-erp/api-clients';
import {
  ApplyGrantPayload,
  GrantApplication,
  ScholarshipGrantItem,
  ScholarshipScheme,
  ScholarshipSummaryDto,
} from './Scholarships.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const scholarshipApi = {
  getApplications: async (semesterId?: string): Promise<GrantApplication[]> => {
    const response = await apiClient.get<GrantApplication[]>('/finance/scholarships/applications', {
      params: { semesterId },
    });
    return toSafeArray<GrantApplication>(response.data);
  },

  getSchemes: async (): Promise<ScholarshipScheme[]> => {
    const response = await apiClient.get<ScholarshipScheme[]>('/finance/scholarships/schemes');
    return toSafeArray<ScholarshipScheme>(response.data);
  },

  approveApplication: async (applicationId: string, approvedDiscountAmount: number): Promise<GrantApplication> => {
    const response = await apiClient.post<GrantApplication>(`/finance/scholarships/applications/${applicationId}/approve`, {
      approvedDiscountAmount,
    });
    return response.data;
  },

  rejectApplication: async (applicationId: string, reason: string): Promise<GrantApplication> => {
    const response = await apiClient.post<GrantApplication>(`/finance/scholarships/applications/${applicationId}/reject`, { reason });
    return response.data;
  },

  getGrants: async (): Promise<ScholarshipGrantItem[]> => {
    const response = await apiClient.get<ScholarshipGrantItem[]>('/finance/scholarships');
    return toSafeArray<ScholarshipGrantItem>(response.data);
  },

  getSummary: async (): Promise<ScholarshipSummaryDto> => {
    const response = await apiClient.get<ScholarshipSummaryDto>('/finance/scholarships/summary');
    return response.data;
  },

  applyGrantToLedger: async (payload: ApplyGrantPayload): Promise<void> => {
    await apiClient.post(`/finance/scholarships/${payload.grantId}/apply`, payload);
  },
};

export const scholarshipsApi = scholarshipApi;
