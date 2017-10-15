import { Observable } from 'rxjs/Observable';
import { IdentifyService } from './../../auth/services/identify.service';
import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable()
export class JadeWsService {

  protected _io = socketIo('192.168.1.25:3001');

  constructor(protected identity: IdentifyService) {
    this._io.on("connect", () => {
      setTimeout(() => this._io.emit("identify", this.identity.currentToken), 500);
    });

    identity.jadeIdentifySubject.subscribe((ad) => {
      this._io.emit("identify", this.identity.currentToken);
    });
  }

  /**
   * On event from server
   * @param event the event to look for
   */
  public on<T=any>(event: string): Observable<T> {
    return new Observable(observer => {

      // Broadcast every event matching what we want
      this._io.on(event, (data) => {
        observer.next(data);
      });

      // Stop listening to those when we're done
      return () => this._io.off(event)

    });
  }

  
  public emit(event:string, data: any) {
    this._io.emit(event, data);
  }

}
