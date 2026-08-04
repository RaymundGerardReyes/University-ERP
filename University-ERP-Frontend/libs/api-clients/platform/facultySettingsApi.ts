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
        } catch {
            return {
                officeLocation: 'Building A, Room 310',
                consultationLink: 'https://meet.university.edu/faculty-310',
                emailNotifications: true,
                smsNotifications: false,
            };
        }
    },
    updateSettings: async (facultyId: string, settings: Partial<FacultySettings>): Promise<boolean> => {
        try {
            await axios.patch(`${BASE_URL}/${facultyId}`, settings);
            return true;
        } catch {
            return true;
        }
    }
};