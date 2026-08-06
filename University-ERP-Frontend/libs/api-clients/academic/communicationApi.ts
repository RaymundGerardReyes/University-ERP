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
        } catch (error) {
            throw error;
        }
    },
    
    sendMessage: async (payload: { recipientId: string, subject: string, body: string }): Promise<boolean> => {
        try {
            const response = await axios.post(`${BASE_URL}/messages`, payload);
            return response.status === 200;
        } catch (error) {
            console.error('Failed to send message', error);
            throw error;
        }
    }
};