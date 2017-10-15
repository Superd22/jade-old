import { WebSocketService } from './../websocket.service';
import { WSUserService } from './websocket-user.service';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { WSGameRoom } from './../../../common/consts/ws/ws-game-room.const';
import { Service, Container } from 'typedi';

@Service()
export class WSGameRoomService {

    protected _WSService = Container.get(WSUserService);
    protected _ws = Container.get(WebSocketService).ws;

    /**
     * Broadcast to the given room
     * @param roomHash 
     * @param data 
     */
    public broadcastToRoom(roomHash: string, event: string, data?: any) {
        const wsRoom = WSGameRoom + roomHash;
        console.log("[WS] Emitting %s to %s", event, wsRoom);
        this._ws.in(wsRoom).emit(event, data);
    }

    /**
     * Tell a socket to join a game-room
     * @param socket the socket to make join the room
     * @param user the user to make join the room
     * @param roomHash 
     */
    public joinRoom(user: IJadeUser, roomHash: string)
    public joinRoom(socket: SocketIO.Socket, roomHash: string)
    public joinRoom(socketOrUser: IJadeUser | SocketIO.Socket, roomHash: string) {
        const wsRoom = WSGameRoom + roomHash;
        if (this.isUser(socketOrUser)) this._WSService.getWsUser(<IJadeUser>socketOrUser).join(wsRoom);
        else {
            // This won't hurt
            (<SocketIO.Socket>socketOrUser).join(wsRoom);
        }
    }

    /**
     * Tell a socket to leave a game-room
     * /!\ a socket won't leave if its parent user wants to stay
     * @param user tell all the sockets of this user to leave
     * @param socket tell this socket to leave 
     */
    public leaveRoom(user: IJadeUser, roomHash: string)
    public leaveRoom(socket: SocketIO.Socket, roomHash: string)
    public leaveRoom(socketOrUser: IJadeUser | SocketIO.Socket, roomHash: string) {
        const wsRoom = WSGameRoom + roomHash;
        if (this.isUser(socketOrUser)) this._WSService.getWsUser(<IJadeUser>socketOrUser).leave(wsRoom);
        else {
            // Even if we supplied a lone socket, we won't leave if the user it belongs to want to stay
            const socketHasUser = this._WSService.getWsUser(<SocketIO.Socket>socketOrUser);
            if (!socketHasUser || !socketHasUser.isIn(wsRoom)) {
                (<SocketIO.Socket>socketOrUser).leave(wsRoom);
            }
        }
    }

    /**
     * Check if a socket | user is an user
     * @param socketOrUser the socket | user to check
     */
    private isUser(socketOrUser: IJadeUser | SocketIO.Socket): boolean {
        return (typeof socketOrUser.id === typeof 123);
    }

    /**
     * Takes a socket or an user and returns either the given socket or all the active sockets for the user
     * @param socketOrUser 
     */
    private getSocketsOfSocketOrUser(socketOrUser: IJadeUser | SocketIO.Socket): SocketIO.Socket[] {
        // Asume we're a token
        let targets: SocketIO.Socket[] = [<SocketIO.Socket>socketOrUser];
        // If we're an user, fetch all our tokens
        if (typeof socketOrUser.id === typeof 123) targets = this._WSService.getSocketOfUser(<number>(socketOrUser.id));

        return targets;
    }


}