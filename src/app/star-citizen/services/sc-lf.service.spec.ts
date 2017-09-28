import { TestBed, inject } from '@angular/core/testing';

import { ScLfService } from './sc-lf.service';

describe('ScLfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScLfService]
    });
  });

  it('should be created', inject([ScLfService], (service: ScLfService) => {
    expect(service).toBeTruthy();
  }));
});
