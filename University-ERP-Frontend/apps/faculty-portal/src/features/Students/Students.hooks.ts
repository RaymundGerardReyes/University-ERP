import { useQuery } from '@tanstack/react-query';
import { FacultyStudent, facultyStudentsApi } from '@university-erp/api-clients';
import { studentsApi } from './Students.api';
import { SectionRosterDto } from './Students.types';

export const useFacultyStudents = (facultyId: string) => {
    return useQuery<FacultyStudent[]>({
        queryKey: ['facultyStudents', facultyId],
        queryFn: () => facultyStudentsApi.getMyStudents(facultyId),
        enabled: !!facultyId
    });
};

export const useSectionRoster = (sectionId: string) => {
    return useQuery<SectionRosterDto>({
        queryKey: ['sectionRoster', sectionId],
        queryFn: () => studentsApi.getSectionRoster(sectionId),
        enabled: !!sectionId
    });
};