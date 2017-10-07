import { IdentifyService } from './../../auth/services/identify.service';
import { xJadeToken } from './../../../common/consts/x-jade-token.const';
import { IJadeAPIResponse, IJadeAPIResponseSuccess, IJadeAPIResponseError } from './../../../common/interfaces/api-response';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { IJadeToken } from './../../../common/interfaces/jade-token';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { MdSnackBar } from '@angular/material';

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

  public get identity(): IJadeToken { return this.identify.jadeIdentifySubject.getValue(); }

  constructor(protected http: HttpClient, protected identify: IdentifyService, protected snackBar: MdSnackBar) {
  }

  public get<T>(endpoint: string): Observable<IJadeAPIResponse<T>> {
    return this.http.get(
      this.getEndpoint(endpoint), this.commonParams()
    ).map(
      (response: HttpResponse<IJadeAPIResponse<T>>) => {
        this.responseHandle(response);
        return response.body;
      });
  }

  public post<T>(endpoint: string, body: any): Observable<IJadeAPIResponse<T>> {
    return this.http.post(
      this.getEndpoint(endpoint), body, this.commonParams()
    ).map(
      (response: HttpResponse<IJadeAPIResponse<T>>) => {
        this.responseHandle(response);
        return response.body;
      });
  }

  public patch<T>(endpoint: string, body: any): Observable<IJadeAPIResponse<T>> {
    return this.http.patch(
      this.getEndpoint(endpoint), body, this.commonParams()
    ).map(
      (response: HttpResponse<IJadeAPIResponse<T>>) => {
        this.responseHandle(response);
        return response.body;
      });
  }

  public delete<T>(endpoint: string): Observable<IJadeAPIResponse<T>> {
    return this.http.delete(
      this.getEndpoint(endpoint), this.commonParams()
    ).map(
      (response: HttpResponse<IJadeAPIResponse<T>>) => {
        this.responseHandle(response);
        return response.body;
      });
  }

  private responseHandle(response: HttpResponse<IJadeAPIResponse>) {
    this.handleResponseToken(response);
    this.handleResponseError(response);
  }

  private handleResponseError(response: HttpResponse<IJadeAPIResponse>) {
    if (response.body.error) {
      this.snackBar.open(response.body.msg, "Erreur", { duration: 5000 });
    }
  }

  private handleResponseToken(response: HttpResponse<IJadeAPIResponse>) {
    console.log(response);
    if (response && response.headers.get(xJadeToken)) {
      this.identify.newToken = response.headers.get(xJadeToken);
    }
  }

  private commonParams(headers?: HttpHeaders, params?: HttpParams): { observe: "response", [st: string]: any } {

    headers = headers || new HttpHeaders();
    headers = headers.set(xJadeToken, this.identify.currentToken);

    params = params || new HttpParams();


    return { observe: 'response', headers: headers, params: params, withCredentials: true };
  }


  private getEndpoint(endpoint: string): string {
    return this._api + endpoint;
  }
}
