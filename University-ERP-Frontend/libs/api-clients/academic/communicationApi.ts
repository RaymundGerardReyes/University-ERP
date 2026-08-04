import axios from 'axios';

const BASE_URL = '/api/v1/academic/communication';

export interface InboxMessage {
    id: string;
    sender: string;
    subject: string;
    date: string;
    isRead: boolean;
}

export const communicationApi = {
    getInbox: async (facultyId: string): Promise<InboxMessage[]> => {
        try {
            const response = await axios.get<InboxMessage[]>(`${BASE_URL}/${facultyId}/inbox`);
            return response.data;
        } catch {
            return [
                { id: 'MSG-01', sender: 'Dean of Engineering', subject: 'Curriculum Update 2026', date: new Date().toISOString(), isRead: false },
                { id: 'MSG-02', sender: 'Alex Morgan (Student)', subject: 'Question regarding Midterm', date: new Date(Date.now() - 86400000).toISOString(), isRead: true },
            ];
        }
    }
};