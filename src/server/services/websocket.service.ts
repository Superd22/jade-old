import { Container } from 'typedi';
import { Service, Inject } from 'typedi';
import { ExpressService } from './express.service';
import * as socketIo from 'socket.io';


/**
 * Main db service
 */
@Service()
export class WebSocketService {
    protected _server: SocketIO.Server;

    public constructor() {
        // This is gonna randomly break one day when the express service gets bootstrapped after this one.
        this._server = socketIo(Container.get(ExpressService).app);
        this.listen();
    }

    private listen() {
        this._server.on('connect', (socket) => {
            console.log(socket);
        });
    }
}
