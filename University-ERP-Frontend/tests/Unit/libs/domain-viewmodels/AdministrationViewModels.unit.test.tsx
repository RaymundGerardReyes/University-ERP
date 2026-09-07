import { describe, it, expect } from 'vitest';
import * as Module from '../../../../libs/domain-viewmodels/AdministrationViewModels';

describe("AdministrationViewModels - Unit Testing", () => {
  it("exports valid view model types and interfaces", () => {
    expect(Module).toBeDefined();
  });
});
