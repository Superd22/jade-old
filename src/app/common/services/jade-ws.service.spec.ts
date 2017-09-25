import { TestBed, inject } from '@angular/core/testing';

import { JadeWsService } from './jade-ws.service';

describe('JadeWsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JadeWsService]
    });
  });

  it('should be created', inject([JadeWsService], (service: JadeWsService) => {
    expect(service).toBeTruthy();
  }));
});
