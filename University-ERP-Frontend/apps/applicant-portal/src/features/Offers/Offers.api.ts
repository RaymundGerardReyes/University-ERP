import { admissionsApi, JourneyStateDto } from '@university-erp/api-clients';
import { RespondOfferPayload } from './Offers.types';

export const offersApi = {
  getApplicantJourney: async (studentId: string): Promise<JourneyStateDto> => {
    return admissionsApi.getApplicantJourney(studentId);
  },

  respondToOffer: async (_payload: RespondOfferPayload): Promise<boolean> => {
    // In current backend, applicant acceptance transitions workflow to Enrollment downpayment
    return true;
  },
};

