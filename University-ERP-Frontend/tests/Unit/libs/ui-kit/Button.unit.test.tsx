import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Button } from '../../../../libs/ui-kit/src/components/Button';

describe("Button - Unit Testing", () => {
  it("renders button label and handles click events", () => {
    const handleClick = vi.fn();
    render(<Button variant="primary" onClick={handleClick}>Submit</Button>);
    const btn = screen.getByRole('button', { name: /submit/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
