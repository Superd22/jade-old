import { WSUser } from './../../controllers/ws/websocket-user';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { UserRegisterService } from './../user-register.service';
import { Container } from 'typedi';
import { Service, Inject } from 'typedi';

@Service()
export class WSUserService {

    /** map of the actives connections for a given user id */
    private _userSocketMap = new Map<number, WSUser>();
    /** map of user appartenance for a given socket id */
    private _socketReverseUserMap = new Map<string, number>();

    constructor() { }

    /**
     * Check if this socket with this JWT should belong to an user or not.
     * @param socket the socket object
     * @param JWT the jwt token we got
     */
    public async checkSocketForUser(socket: SocketIO.Socket, JWT: string) {
        const user = await Container.get(UserRegisterService).findUserFromToken(JWT);

        if (user.id) {
            this.setSocketToUser(socket, user.id);
        }
    }

    /**
     * Callback on socket disconnect
     * @param socket 
     */
    public disconectSocket(socket: SocketIO.Socket) {
        const userIdFromSocket = this._socketReverseUserMap.get(socket.id);
        if(userIdFromSocket) {
            this.remSocketToUser(socket, userIdFromSocket);
        }
    }


    /**
     * Associates a socket to a given user id for latter use
     * @param socket 
     * @param userId 
     */
    public setSocketToUser(socket: SocketIO.Socket, userId: number) {
        if (userId > 0) {
            // Ensure we have an array
            if (!this._userSocketMap.has(userId)) this._userSocketMap.set(userId, new WSUser(userId));
            // Push our relation
            this._userSocketMap.get(userId).register(socket);
            // Sync reverse relation
            this._socketReverseUserMap.set(socket.id, userId);
        }
    }

    /**
     * Removes the association between a socket and an userid
     * @param socket 
     * @param userId 
     */
    public remSocketToUser(socket: SocketIO.Socket, userId: number) {
        if (userId > 0) {
            const wsuser = this._userSocketMap.get(userId);
            if (wsuser) {
                wsuser.remove(socket);
                // gc - prevent memory leak
                if (wsuser.sockets.length === 0) this._userSocketMap.delete(userId);
            }
            else throw "tried removing socket/user association on a non associated socket";

            // And remove the reverse relation
            this._socketReverseUserMap.delete(socket.id);
        }
    }

    /**
     * Returns the active sockets of a given user
     * @param userId an user id
     * @param user the user object
     */
    public getSocketOfUser(userId: number): SocketIO.Socket[]
    public getSocketOfUser(user: IJadeUser): SocketIO.Socket[]
    public getSocketOfUser(user): SocketIO.Socket[] {
        const wsuser = this.getWsUser(user);
        if (wsuser) return wsuser.sockets;
        return [];
    }

    /**
     * Get the ws helper for the supplied user
     * @param userId get the helper by user id
     * @param user get the helper by user
     */
    public getWsUser(userId: number): WSUser
    public getWsUser(user: IJadeUser): WSUser
    public getWsUser(socket: SocketIO.Socket): WSUser
    public getWsUser(user): WSUser {
        // We're IJadeUser | SocketIO.Socket
        if (typeof user !== typeof 123) user = user.id;
        // We're IJadeUser
        if (typeof user === typeof 123)
            return this._userSocketMap.get(user);
        // We're SocketIO.Socket
        else {
            // Check if we have this socket in our reverse
            const id = this._socketReverseUserMap.get(user);
            // If we do return the user it belongs to
            return this._userSocketMap.get(id);
        }
    }

}