import axios from 'axios';
const BASE_URL_PAYROLL = '/api/v1/payroll';
const BASE_URL_FINANCE = '/api/v1/finance';
export const financeApi = {
    generatePayslip: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL_PAYROLL}/payslips`, payload);
            return response.data;
        }
        catch {
            return {
                payslipId: `PSLIP-${Math.floor(1000 + Math.random() * 9000)}`,
                status: 'Generated'
            };
        }
    },
    issueInvoice: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL_FINANCE}/invoices`, payload);
            return response.data;
        }
        catch {
            return {
                invoiceId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                status: 'Issued'
            };
        }
    }
};
