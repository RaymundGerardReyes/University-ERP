import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursePackagingApi } from './CoursePackaging.api';

export function useCoursePackages() {
  return useQuery({
    queryKey: ['lmsCoursePackages'],
    queryFn: () => coursePackagingApi.getPackages()
  });
}

export function useCompilePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseCode: string) => coursePackagingApi.compilePackage(courseCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lmsCoursePackages'] });
    }
  });
}

export function usePublishPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (packageId: string) => coursePackagingApi.publishPackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lmsCoursePackages'] });
    }
  });
}
