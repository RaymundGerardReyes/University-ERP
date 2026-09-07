import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageHeader } from '../../../../libs/ui-kit/src/components/PageHeader';

describe("PageHeader - Unit Testing", () => {
  it("renders page header title and subtitle", () => {
    render(<PageHeader title="Faculty Portal" subtitle="Manage courses and students" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Faculty Portal');
    expect(screen.getByText('Manage courses and students')).toBeInTheDocument();
  });
});
