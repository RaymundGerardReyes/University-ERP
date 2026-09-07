import { describe, it, expect } from 'vitest';
import { apiClient } from '../../../../libs/api-clients/apiClient';

describe("apiClient - Unit Testing", () => {
  it("exports configured axios apiClient instance", () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe('function');
    expect(typeof apiClient.post).toBe('function');
  });
});
