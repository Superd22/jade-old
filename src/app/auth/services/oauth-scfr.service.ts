import { Injectable } from '@angular/core';
import { OauthService } from './oauth.service';
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';

@Injectable()
export class OauthSCFRService extends OauthService {

  protected client_id = "jade";
  protected api_url = "https://starcitizen.fr/Forum/app.php/oauth2/v1/";
  protected provider: oAuthProviders = "scfr";

  constructor() {
    super();
  }



}
