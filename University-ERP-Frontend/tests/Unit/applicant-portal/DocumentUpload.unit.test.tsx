// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: DocumentUpload
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/DocumentUpload/DocumentUpload.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/DocumentUpload/DocumentUpload.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/DocumentUpload/DocumentUpload.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/DocumentUpload/DocumentUpload.types.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentUploadPage } from '../../../apps/applicant-portal/src/features/DocumentUpload/DocumentUpload.page';

const mockUploadDocument = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { uploadDocument: (...args: any) => mockUploadDocument(...args) }
}));

describe('DocumentUpload Feature', () => {
  it('TC07: DocumentUpload_Should_Display_Error_If_File_Exceeds_Size_Limit', async () => {
    render(<DocumentUploadPage />);
    const uploader = screen.getByTestId('document-dropzone');
    
    const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    await userEvent.upload(uploader, largeFile);

    expect(screen.getByText(/File exceeds maximum size/i)).toBeDefined();
    expect(mockUploadDocument).not.toHaveBeenCalled();
  });

  it('TC08: DocumentUpload_Should_Call_UploadAPI_And_Update_Status_To_Uploaded', async () => {
    mockUploadDocument.mockResolvedValue(true);
    render(<DocumentUploadPage />);
    
    const uploader = screen.getByTestId('document-dropzone');
    const validFile = new File(['content'], 'transcript.pdf', { type: 'application/pdf' });
    await userEvent.upload(uploader, validFile);

    const uploadBtn = screen.getByRole('button', { name: /Upload/i });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(mockUploadDocument).toHaveBeenCalled();
      expect(screen.getByText(/Uploaded Successfully/i)).toBeDefined();
    });
  });
});
