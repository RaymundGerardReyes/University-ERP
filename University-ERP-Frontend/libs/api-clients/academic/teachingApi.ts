import axios from 'axios';

const BASE_URL = '/api/v1/academic/teaching';

export interface CourseSection {
    id: string;
    courseCode: string;
    courseName: string;
    sectionName: string;
    schedule: string;
    room: string;
    enrolledCount: number;
}

export const teachingApi = {
    // Fetch the courses assigned to the currently logged-in faculty member
    getMyCourses: async (facultyId: string): Promise<CourseSection[]> => {
        try {
            const response = await axios.get<CourseSection[]>(`${BASE_URL}/faculty/${facultyId}/courses`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Submit attendance for a specific class section
    submitAttendance: async (sectionId: string, attendanceData: any): Promise<boolean> => {
        try {
            await axios.post(`${BASE_URL}/sections/${sectionId}/attendance`, attendanceData);
            return true;
        } catch (error) {
            throw error;
        }
    }
};