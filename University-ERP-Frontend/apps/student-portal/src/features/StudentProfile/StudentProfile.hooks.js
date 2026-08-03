import { useQuery } from '@tanstack/react-query';
import { studentInformationApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
export const useStudentProfile = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['studentProfile', user?.id],
        queryFn: () => studentInformationApi.getProfile(user.id),
        // Only execute the query if we successfully have a logged-in user
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache the profile for 5 minutes
    });
};
