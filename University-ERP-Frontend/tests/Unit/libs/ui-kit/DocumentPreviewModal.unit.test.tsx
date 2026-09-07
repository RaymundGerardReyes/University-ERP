import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { DocumentPreviewModal } from '../../../../libs/ui-kit/src/components/DocumentPreviewModal';

describe("DocumentPreviewModal - Unit Testing", () => {
  it("renders document preview modal when open", () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        documentName="syllabus.pdf"
        documentUrl="http://example.com/syllabus.pdf"
        mimeType="application/pdf"
      />
    );
    expect(screen.getByText('Document Preview')).toBeInTheDocument();
    expect(screen.getByText('syllabus.pdf')).toBeInTheDocument();
  });
});
