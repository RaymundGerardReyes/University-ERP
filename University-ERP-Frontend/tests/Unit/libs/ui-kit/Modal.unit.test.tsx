import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Modal } from '../../../../libs/ui-kit/src/components/Modal';

describe("Modal - Unit Testing", () => {
  it("renders modal children when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal Content Visible</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content Visible')).toBeInTheDocument();
  });
});
