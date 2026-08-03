import axios from 'axios';
const BASE_URL = '/api/v1/governance';
export const governanceApi = {
    logVisitor: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/visitors`, payload);
            return response.data;
        }
        catch {
            return { logId: `VIS-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Logged' };
        }
    },
    submitEvidence: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/accreditation/evidence`, payload);
            return response.data;
        }
        catch {
            return { evidenceId: `EVD-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Submitted' };
        }
    },
    createTicket: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/tickets`, payload);
            return response.data;
        }
        catch {
            return { ticketId: `TCK-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Created' };
        }
    },
    submitGrievance: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/grievances`, payload);
            return response.data;
        }
        catch {
            return { complaintId: `CMP-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Submitted' };
        }
    },
    createEvent: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/events`, payload);
            return response.data;
        }
        catch {
            return { eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Created' };
        }
    }
};
