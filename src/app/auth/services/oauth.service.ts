import { ServiceLocator } from './service-locator';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class OauthService {
  /** the app client id for the target */
  protected abstract client_id;
  protected abstract api_url: string;
  protected scope: string = "identify";

  protected http: HttpClient;

  constructor() {
    this.http = ServiceLocator.injector.get(HttpClient);
  }

  /**
   * Prompt the user to auth this client
   */
  protected get_authorization() {
    window.open(this.api_url + "authorize?response_type=code&client_id=" + this.client_id + "&scope=" + this.scope);
  }


  /**
   * Get an oauth token from authorization code
   */
  protected get_token_from_code(code: string) {
    
  }

}
