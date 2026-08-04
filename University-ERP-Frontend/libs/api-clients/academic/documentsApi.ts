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
        } catch {
            // Robust Mock Data for UI/UX Development
            return [
                { id: 'DOC-001', name: 'CS-101 Standard Syllabus Template.docx', category: 'Syllabus', uploadDate: '2026-07-15', size: '245 KB' },
                { id: 'DOC-002', name: 'University Academic Integrity Policy.pdf', category: 'Policy', uploadDate: '2026-08-01', size: '1.2 MB' },
                { id: 'DOC-003', name: 'Grade Override Request Form.pdf', category: 'Form', uploadDate: '2026-01-10', size: '150 KB' },
                { id: 'DOC-004', name: 'NSF Grant Proposal Draft_v2.pdf', category: 'Research', uploadDate: '2026-08-14', size: '3.4 MB' },
            ];
        }
    }
};