export interface EnrollmentCourseOption {
  id: string;
  courseCode: string;
  title: string;
  units: number;
  schedule: string;
  room: string;
  instructor: string;
  availableSlots: number;
  totalCapacity: number;
}
