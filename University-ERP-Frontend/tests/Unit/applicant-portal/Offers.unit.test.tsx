// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: Offers
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/Offers/Offers.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/Offers/Offers.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/Offers/Offers.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/Offers/Offers.types.ts

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OffersPage } from '../../../../apps/applicant-portal/src/features/Offers/Offers.page';

describe('Offers Feature', () => {
  it('TC13: Offers_Should_Render_Accept_Offer_Button_When_Status_Is_Accepted', () => {
    render(<OffersPage status="Accepted" />);
    expect(screen.getByRole('button', { name: /Accept Admission Offer/i })).toBeDefined();
  });
});
