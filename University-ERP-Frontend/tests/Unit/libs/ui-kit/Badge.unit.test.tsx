import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../../../../libs/ui-kit/src/components/Badge';

describe("Badge - Unit Testing", () => {
  it("renders badge with text and custom colorScheme", () => {
    render(<Badge colorScheme="success">Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
