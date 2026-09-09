export interface CoursePackageDto {
  id: string;
  courseCode: string;
  moduleTitle: string;
  packageSize: string;
  versionManifest: string;
  status: 'Draft' | 'Compiled' | 'Published' | 'Archived';
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  isVerified: boolean;
  updatedAt: string;
}

export interface CompilePackagePayload {
  courseCode: string;
  includeQuizzes: boolean;
  includeVideos: boolean;
}
