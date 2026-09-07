import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { FormInput } from '../../../../libs/ui-kit/src/components/FormInput';

describe("FormInput - Unit Testing", () => {
  it("renders input and handles value changes", () => {
    const handleChange = vi.fn();
    render(<FormInput placeholder="Enter username" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'alice' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
