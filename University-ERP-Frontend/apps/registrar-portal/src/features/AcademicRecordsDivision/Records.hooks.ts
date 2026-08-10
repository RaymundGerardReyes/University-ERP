import { useQuery } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { OfficialGradeItem } from './Records.types';

export const useOfficialGrades = () => {
    return useQuery<OfficialGradeItem[]>({
        queryKey: ['officialGrades'],
        queryFn: async () => {
            const data = await registrarApi.getOfficialGrades();
            return data.map((item: any, index: number) => ({
                id: item.id || `grade-${index}`,
                section: item.section,
                subject: item.subject,
                credits: item.credits || 3,
                faculty: item.faculty,
                status: item.status,
                grade: item.grade || null
            }));
        }
    });
};