import { describe, it, expect } from 'vitest';
import { bootstrapPortal } from '../../../../libs/shell-kit/bootstrap';

describe("bootstrap - Unit Testing", () => {
  it("defines bootstrapPortal function", () => {
    expect(typeof bootstrapPortal).toBe('function');
  });
});
