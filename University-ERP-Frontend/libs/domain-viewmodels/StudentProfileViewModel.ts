export interface StudentProfileViewModel {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  academicStanding: string;
  enrollmentStatus: string;
}

export interface CourseEnrollmentViewModel {
  id: string;
  courseCode: string;
  courseName: string;
  term: string;
  grade: string | null;
  credits: number;
}
