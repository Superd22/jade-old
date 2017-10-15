import { WSGameRoomService } from './../../services/ws/websocket-gameroom.service';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { DbService } from './../../services/db.service';
import { Container } from 'typedi';
/**
 * Describes an web-socket user with (potentially) multiple sockets
 */
export class WSUser {

    private _id: number;
    public get id() { return this._id }
    /** array of active rooms for the socket of this user */
    private _activeRooms: { [name: string]: string } = {};
    public get activeRooms() { return Object.keys(this._activeRooms); }
    /** active sockets for this user */
    private _sockets: { [id: string]: SocketIO.Socket } = {};
    public get sockets() { return Object.values(this._sockets); }


    constructor(userId: number) {
        console.log("[WS] User %d now connected to ws", userId);
        this._id = userId;

        this.syncState();
    }

    /**
     * Attempts to sync the state to what we're supposed to look like on init
     */
    private async syncState() {
        const user = await Container.get(DbService).repo(JadeUserEntity).findOneById(this._id, { relations: ['group'] });
        if (user) {
            console.log("sync of user", user);
            if (user.group) {
                console.log("sync of group", user.group);
                Container.get(WSGameRoomService).joinRoom(user, user.group.hashId);
            }
        }
    }

    /**
     * Registers a socket to this user
     * @param socket 
     */
    public register(socket: SocketIO.Socket) {
        // Keep this socket in mind
        this._sockets[socket.id] = socket;
        // Sync our state
        this.activeRooms.map((roomToJoin) => socket.join(roomToJoin));
        console.log("[WS] registering a new socket %s to User %d", socket.id, this._id);
    }

    /**
     * Removes the supplied socket from the user active sockets
     * @param socket 
     */
    public remove(socket: SocketIO.Socket) {
        if (this._sockets[socket.id]) {
            socket.leaveAll();
            delete (this._sockets[socket.id]);
            console.log("[WS] removed a socket from User %d, left with %d sockets", this._id, this.sockets.length);
        }
    }

    /**
     * Make this user join the given io room.
     * This will force every active socket of this user to join
     * @param room the name of the room to join
     */
    public join(room: string) {
        console.log("[WS] User %d joining room %s", this._id, room);
        this.sockets.map((socket) => socket.join(room));
        this._activeRooms[room] = room;
    }

    /**
     * Make this user leave a given room
     * This will force every active socket of this user to leave
     * @param room 
     */
    public leave(room: string) {
        console.log("[WS] User %d leaving room %s", this._id, room);
        this.sockets.map((socket) => socket.leave(room));
        delete (this._activeRooms[room]);
    }

    /**
     * Check if the current user is in a room
     * @param room the room to check
     */
    public isIn(room: string): boolean {
        return Boolean(this._activeRooms[room]);
    }

} 