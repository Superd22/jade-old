import { TestBed, inject } from '@angular/core/testing';

import { JadeApiService } from './jade-api.service';

describe('JadeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JadeApiService]
    });
  });

  it('should be created', inject([JadeApiService], (service: JadeApiService) => {
    expect(service).toBeTruthy();
  }));
});
