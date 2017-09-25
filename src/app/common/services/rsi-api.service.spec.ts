import { TestBed, inject } from '@angular/core/testing';

import { RsiApiService } from './rsi-api.service';

describe('RsiApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RsiApiService]
    });
  });

  it('should be created', inject([RsiApiService], (service: RsiApiService) => {
    expect(service).toBeTruthy();
  }));
});
