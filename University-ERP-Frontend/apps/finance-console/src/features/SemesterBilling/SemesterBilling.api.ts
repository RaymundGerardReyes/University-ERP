import axios from 'axios';
import { InvoiceDto, SemesterAssessmentDto } from './SemesterBilling.types';

const BASE_URL = '/api/v1/finance/semester-billing';

export const semesterBillingApi = {
    getPendingAssessments: async (termId: string): Promise<SemesterAssessmentDto[]> => {
        const response = await axios.get(`${BASE_URL}/assessments/pending`, { params: { termId } });
        return response.data;
    },

    finalizeAssessment: async (assessmentId: string): Promise<InvoiceDto> => {
        const response = await axios.post(`${BASE_URL}/assessments/${assessmentId}/finalize`);
        return response.data;
    },

    getTermInvoices: async (termId: string): Promise<InvoiceDto[]> => {
        const response = await axios.get(`${BASE_URL}/invoices`, { params: { termId } });
        return response.data;
    }
};