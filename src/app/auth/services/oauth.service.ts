import { JadeApiService } from './../../common/services/jade-api.service';
import { ServiceLocator } from './service-locator';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';

@Injectable()
export abstract class OauthService {
  /** the app client id for the target */
  protected abstract client_id;
  protected abstract api_url: string;
  protected abstract provider: oAuthProviders;
  protected scope: string = "identify";

  protected http: HttpClient;
  protected api: JadeApiService;

  constructor() {
    this.http = ServiceLocator.injector.get(HttpClient);
    this.api = ServiceLocator.injector.get(JadeApiService);
  }

  /**
   * Prompt the user to auth this client
   */
  public get_authorization() {
    console.log(this.client_id, this.client_id == 360994842119241730)
    window.open(this.api_url + "authorize?response_type=code&client_id=" + String(this.client_id) + "&scope=" + this.scope);
  }


  /**
   * Get an oauth token from authorization code
   */
  public get_token_from_code(code: string) {
    return this.api.get("oauth/getToken/" + this.provider + "/" + code).map((data) => {
      console.log(data);
      return data;
    });

  }

}
