export interface StudentDashboardSummary {
  studentId: string;
  fullName: string;
  program: string;
  yearLevel: string;
  academicStanding: string;
  cumulativeGpa: number;
  enrolledUnits: number;
  maxUnitsAllowed: number;
  tuitionOutstandingBalance: number;
  clearanceStatus: 'CLEARED' | 'PENDING' | 'HOLD';
  nextClass: {
    courseCode: string;
    courseTitle: string;
    room: string;
    startTime: string;
    instructor: string;
  };
}
