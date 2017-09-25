import { JadeMaterialModule } from './material.module';

describe('MaterialModule', () => {
  let materialModule: JadeMaterialModule;

  beforeEach(() => {
    materialModule = new JadeMaterialModule();
  });

  it('should create an instance', () => {
    expect(materialModule).toBeTruthy();
  });
});
