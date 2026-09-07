import { describe, it, expect } from 'vitest';
import { createAuthConfig } from '../../../../libs/shell-kit/authConfig';

describe("authConfig - Unit Testing", () => {
  it("creates valid auth configuration object", () => {
    expect(createAuthConfig).toBeDefined();
    const config = createAuthConfig('https://auth.university.edu', 'client-123');
    expect(config.authority).toBe('https://auth.university.edu');
    expect(config.client_id).toBe('client-123');
    expect(config.response_type).toBe('code');
  });
});
