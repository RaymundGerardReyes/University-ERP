import { describe, it, expect } from 'vitest';
import { queryClient } from '../../../../libs/shell-kit/queryClient';

describe("queryClient - Unit Testing", () => {
  it("exports a configured TanStack QueryClient instance", () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.getQueryCache).toBe('function');
  });
});
