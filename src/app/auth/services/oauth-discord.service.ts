import { Injectable } from '@angular/core';
import { OauthService } from './oauth.service';
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';

@Injectable()
export class OauthDiscordService extends OauthService {

  protected client_id = "360994842119241730";
  protected api_url = "https://discordapp.com/api/oauth2/";
  protected provider: oAuthProviders = "discord";

  constructor() {
    super();
  }



}
