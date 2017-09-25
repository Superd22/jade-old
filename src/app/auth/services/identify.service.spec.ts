import { TestBed, inject } from '@angular/core/testing';

import { IdentifyService } from './identify.service';

describe('IdentifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdentifyService]
    });
  });

  it('should be created', inject([IdentifyService], (service: IdentifyService) => {
    expect(service).toBeTruthy();
  }));
});
