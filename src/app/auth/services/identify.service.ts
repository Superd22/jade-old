import { JadeApiService } from './../../common/services/jade-api.service';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { IJadeToken } from './../../../common/interfaces/jade-token';
import { Injectable } from '@angular/core';
import { JadeLocalStorage } from '../../common/decorators/local-storage.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class IdentifyService {

  /** current local storage token  */
  @JadeLocalStorage("token")
  private _currentToken: string;
  /** current local storage (encoded) token */
  public get currentToken(): string { return this._currentToken; }
  /** current (decoded) identify token */
  private _jadeIdentify: BehaviorSubject<IJadeToken> = new BehaviorSubject(null);
  public get jadeIdentifySubject(): BehaviorSubject<IJadeToken> { return this._jadeIdentify; }

  private _isAnonymous = true;
  /** if we're in anon mode or we have an identity */
  public get isAnonymous(): boolean { return this._isAnonymous; }

  constructor() {
    this.syncState();
  }

  /**
   * New JWT auth token to be used app-wide.
   */
  public set newToken(token: string) {
    this._currentToken = token;
    this._jadeIdentify.next(this.decodeToken(this._currentToken));
  }

  /**
   * Decode a given token, without veryfying it.
   * @param token the encoded JWT to decode
   * @return the token
   */
  public decodeToken(token: string): IJadeToken {
    return <IJadeToken>jwt.decode(token);
  }

  private syncState() {
    this._jadeIdentify.subscribe((token) => {
      if (token) {
        // Set anon if we are
        this._isAnonymous = (token.jadeUserId < 0);
      }
    });
  }

  /**
   * Declare to the back-end that we want this handle
   * 
   * @param handle the rsi handle we want 
   */
  public trySetHandle(handle: string) {
    //this.jadeApi.get()
  }

}
