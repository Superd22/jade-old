import { Injectable } from '@angular/core';
import { OauthService } from './oauth.service';

@Injectable()
export class OauthDiscordService extends OauthService {

  protected client_id = 360994842119241730;
  protected api_url = "https://discordapp.com/api/oauth2/";
   
  constructor() {
    super();
  }

  

}
