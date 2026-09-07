import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../../../../libs/ui-kit/src/components/EmptyState';

describe("EmptyState - Unit Testing", () => {
  it("renders empty state title and description", () => {
    render(<EmptyState title="No Records" description="Please try again later." />);
    expect(screen.getByText('No Records')).toBeInTheDocument();
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });
});
