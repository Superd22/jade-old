import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable()
export class JadeWsService {

  protected _io = socketIo('192.168.1.25:3001');

  constructor() {
    console.log("caca");
   }

}
