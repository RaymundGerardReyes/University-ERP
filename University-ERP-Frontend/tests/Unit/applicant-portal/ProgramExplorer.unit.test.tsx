// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: ProgramExplorer
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { ProgramExplorerPage } from '../../../../apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.page';

const mockGetProgramCatalog = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { getProgramCatalog: () => mockGetProgramCatalog() }
}));

describe('ProgramExplorer Feature', () => {
  it('TC06: ProgramExplorer_Should_Display_Available_Programs_From_Catalog', async () => {
    const queryClient = new QueryClient();
    mockGetProgramCatalog.mockResolvedValue([
      { id: 'BSCS', major: 'Computer Science', college: 'CCS' }
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <ProgramExplorerPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Computer Science/i)).toBeDefined();
    });
  });
});
