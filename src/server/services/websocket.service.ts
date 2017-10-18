import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { WSGameRoomService } from './ws/websocket-gameroom.service';
import { Container } from 'typedi';
import { Service, Inject } from 'typedi';
import { ExpressService } from './express.service';
import { WSUserService } from './ws/websocket-user.service';
import * as socketIo from 'socket.io';


/**
 * Main db service
 */
@Service()
export class WebSocketService {
    protected _server: SocketIO.Server;
    public get ws(): SocketIO.Server { return this._server; }
    protected _bots: SocketIO.Namespace;
    public get botsWS() { return this._bots; }
    protected _users: SocketIO.Namespace;
    public ready = new BehaviorSubject(false);

    public constructor() {
        // This is gonna randomly break one day when the express service gets bootstrapped after this one.
        this._server = socketIo(Container.get(ExpressService).app);

        this._bots = this._server.of("/bots");
        this._users = this._server.of("/users");

        this.listen();
    }

    private listen() {
        this._server.on('connect', (socket) => {
            if (!this.ready.getValue()) this.ready.next(true);
            this.callbacks(socket);
        });

    }

    private callbacks(socket: SocketIO.Socket) {
        socket.on("identify", (jwt: string) => {
            Container.get(WSUserService).checkSocketForUser(socket, jwt);
        });

        socket.on("disconnect", () => {
            Container.get(WSUserService).disconectSocket(socket);
        });

        Container.get(WSGameRoomService).callbacks(socket);

    }
}
