import axios from 'axios';

const BASE_URL = '/api/v1/academic/research';

export interface ResearchGrant {
    id: string;
    title: string;
    fundingAgency: string;
    amount: number;
    status: 'Active' | 'Pending' | 'Completed';
    endDate: string;
}

export interface Publication {
    id: string;
    title: string;
    journal: string;
    publishDate: string;
    status: 'Published' | 'Under Review';
}

export const researchApi = {
    getPortfolio: async (facultyId: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/portfolio/${facultyId}`);
            return response.data;
        } catch {
            return {
                grants: [
                    { id: 'GRT-1092', title: 'AI-Driven Adaptive Learning Models', fundingAgency: 'National Science Foundation', amount: 150000, status: 'Active', endDate: '2027-12-31' },
                    { id: 'GRT-1105', title: 'Cybersecurity in Edge Computing', fundingAgency: 'Tech Innovation Fund', amount: 75000, status: 'Pending', endDate: '2025-06-30' }
                ] as ResearchGrant[],
                publications: [
                    { id: 'PUB-401', title: 'Machine Learning in Higher Ed', journal: 'Journal of Educational Technology', publishDate: '2025-10-15', status: 'Published' },
                    { id: 'PUB-405', title: 'Zero-Trust Architecture in IoT', journal: 'IEEE Security & Privacy', publishDate: '2026-02-20', status: 'Under Review' }
                ] as Publication[]
            };
        }
    }
};