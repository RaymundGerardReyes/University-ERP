import axios from 'axios';

const BASE_URL = '/api/v1/academic/documents';

export interface FacultyDocument {
    id: string;
    name: string;
    category: 'Syllabus' | 'Policy' | 'Form' | 'Research';
    uploadDate: string;
    size: string;
}

export const documentsApi = {
    getDocuments: async (facultyId: string): Promise<FacultyDocument[]> => {
        try {
            const response = await axios.get<FacultyDocument[]>(`${BASE_URL}/${facultyId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};