import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../../../../libs/ui-kit/src/components/Card';

describe("Card - Unit Testing", () => {
  it("renders card container with children", () => {
    render(<Card><h2>Card Title</h2><p>Card Content</p></Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
});
