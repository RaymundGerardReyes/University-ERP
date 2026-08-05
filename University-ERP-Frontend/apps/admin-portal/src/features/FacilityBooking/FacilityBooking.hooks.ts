import { useMutation, useQuery } from '@tanstack/react-query';
import { FacilityBookingPayload } from '@university-erp/domain-viewmodels';
import { fetchCampusFacilities, submitFacilityBooking } from './FacilityBooking.api';

export const useCampusFacilities = () => {
    return useQuery({
        queryKey: ['campusFacilities'],
        queryFn: fetchCampusFacilities,
    });
};

export const useBookFacility = () => {
    return useMutation({
        mutationFn: (payload: FacilityBookingPayload) => submitFacilityBooking(payload),
    });
};