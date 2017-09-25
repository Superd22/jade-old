import { IJadeAPIResponse, IJadeAPIResponseSuccess, IJadeAPIResponseError } from './../../../common/interfaces/api-response';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Main helper service to access the jade REST api
 */
@Injectable()
export class JadeApiService {

  /** 
   * api adress
   * @todo dynamic env
   */
  protected _api = "http://192.168.1.25:3001/";

  constructor(protected http: HttpClient) { }

  public get(endpoint: string): Observable<IJadeAPIResponse> {
    return this.http.get(this.getEndpoint(endpoint)).map(
      (value) => <IJadeAPIResponseSuccess>value
    ).catch(
      (err) => Observable.of(err)
      );
  }


  private getEndpoint(endpoint: string): string {
    return this._api + endpoint;
  }
}
