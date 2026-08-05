import { facilitiesApi } from '@university-erp/api-clients';
import { FacilityBookingPayload } from '@university-erp/domain-viewmodels';

export const submitFacilityBooking = async (payload: FacilityBookingPayload) => {
    return facilitiesApi.bookFacility(payload);
};

export const fetchCampusFacilities = async () => {
    return [
        { id: 'FAC-101', name: 'Main Auditorium', capacity: 500, type: 'Event Hall', status: 'Available' },
        { id: 'FAC-102', name: 'Engineering Lab 4', capacity: 40, type: 'Laboratory', status: 'In Use' },
        { id: 'FAC-103', name: 'Conference Room B', capacity: 15, type: 'Meeting Room', status: 'Maintenance' },
    ];
};