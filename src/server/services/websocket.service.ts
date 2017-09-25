import { Service, Inject } from 'typedi';
import { ExpressService } from './express.service';
import * as io from 'socket.io';


/**
 * Main db service
 */
@Service()
export class WebSocketService {
    protected _server: SocketIO.Server;

    public constructor() {
        this._server = io();
    }
}