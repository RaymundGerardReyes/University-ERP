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
        } catch (error) {
            throw error;
        }
    }
};