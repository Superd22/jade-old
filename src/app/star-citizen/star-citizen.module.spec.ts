import { StarCitizenModule } from './star-citizen.module';

describe('StarCitizenModule', () => {
  let starCitizenModule: StarCitizenModule;

  beforeEach(() => {
    starCitizenModule = new StarCitizenModule();
  });

  it('should create an instance', () => {
    expect(starCitizenModule).toBeTruthy();
  });
});
