import { TestBed, inject } from '@angular/core/testing';

import { OauthDiscordService } from './oauth-discord.service';

describe('OauthDiscordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OauthDiscordService]
    });
  });

  it('should be created', inject([OauthDiscordService], (service: OauthDiscordService) => {
    expect(service).toBeTruthy();
  }));
});
