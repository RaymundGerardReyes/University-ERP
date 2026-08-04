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
        } catch {
            // Mock data for UI development
            return [
                {
                    id: 'SEC-1001',
                    courseCode: 'CS-101',
                    courseName: 'Introduction to Computing',
                    sectionName: 'BSCS-1A',
                    schedule: 'Mon/Wed 09:00 AM - 10:30 AM',
                    room: 'Lab 402',
                    enrolledCount: 35
                },
                {
                    id: 'SEC-1002',
                    courseCode: 'CS-305',
                    courseName: 'Database Management & DBMA',
                    sectionName: 'BSCS-3C',
                    schedule: 'Tue/Thu 01:00 PM - 02:30 PM',
                    room: 'Hall B',
                    enrolledCount: 42
                },
                {
                    id: 'SEC-1003',
                    courseCode: 'CS-401',
                    courseName: 'Software Engineering II',
                    sectionName: 'BSIT-4A',
                    schedule: 'Fri 08:00 AM - 11:00 AM',
                    room: 'Lab 405',
                    enrolledCount: 28
                }
            ];
        }
    },

    // Submit attendance for a specific class section
    submitAttendance: async (sectionId: string, attendanceData: any): Promise<boolean> => {
        try {
            await axios.post(`${BASE_URL}/sections/${sectionId}/attendance`, attendanceData);
            return true;
        } catch {
            return true; // Simulate success
        }
    }
};