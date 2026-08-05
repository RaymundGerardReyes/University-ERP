import axios from 'axios';

const BASE_URL = '/api/v1/platform/settings/faculty';

export interface FacultySettings {
    officeLocation: string;
    consultationLink: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
}

export const facultySettingsApi = {
    getSettings: async (facultyId: string): Promise<FacultySettings> => {
        try {
            const response = await axios.get<FacultySettings>(`${BASE_URL}/${facultyId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateSettings: async (facultyId: string, settings: Partial<FacultySettings>): Promise<boolean> => {
        try {
            await axios.patch(`${BASE_URL}/${facultyId}`, settings);
            return true;
        } catch (error) {
            throw error;
        }
    }
};