import { describe, it, expect } from 'vitest';
import { portalRegistry, getAllowedOrigins } from '../../../../libs/shell-kit/portalRegistry';

describe("portalRegistry - Unit Testing", () => {
  it("contains registry entries for all standard portals", () => {
    expect(portalRegistry.admin).toBeDefined();
    expect(portalRegistry.faculty).toBeDefined();
    expect(portalRegistry.student).toBeDefined();
    expect(portalRegistry.finance).toBeDefined();
  });

  it("returns list of allowed origins", () => {
    const origins = getAllowedOrigins();
    expect(Array.isArray(origins)).toBe(true);
    expect(origins.length).toBeGreaterThan(0);
  });
});
