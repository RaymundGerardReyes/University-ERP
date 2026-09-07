import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from '../../../../libs/ui-kit/src/components/Table';

describe("Table - Unit Testing", () => {
  it("renders table with header and row content", () => {
    render(
      <Table>
        <thead>
          <tr><th>ID</th><th>Name</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Alice</td></tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
