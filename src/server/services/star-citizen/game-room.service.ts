import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { Container } from 'typedi';
import { DbService } from './../db.service';
import { SCGameRoomEntity } from './../../entity/star-citizen/game-room.entity';
import { Service } from 'typedi';
import { ISCGameRoom } from "../../../common/interfaces/star-citizen/group.interface";
import { WSGameRoomService } from '../ws/websocket-gameroom.service';


@Service()
export class SCGameRoomService {

    private _wsGC = Container.get(WSGameRoomService);

    /**
     * Removes a group from the db
     * @param room 
     */
    public async deleteGameRoom(room: ISCGameRoom) {
        // Get the room
        const dbRoom = await Container.get(DbService).repo(SCGameRoomEntity).findOneById(room.id, { relations: ["players"] });

        // Remove every player
        dbRoom.players.map((player) => {
            player.setGroup(null);
        });

        // And remove the room
        await Container.get(DbService).repo(SCGameRoomEntity).remove(dbRoom);

        return true;
    }

    /**
     * Creates a group in the db
     * @param createdBy 
     * @param room 
     */
    public async createGameRoom(createdBy: IJadeUser, room: ISCGameRoom) {
        // Create the room
        console.log("wzeow");
        let gameRoom: SCGameRoomEntity = await Container.get(DbService).buildNewOrGetExistingByHash(room, SCGameRoomEntity, "gameroom", ['players']);
        let updating = Boolean(gameRoom.id);
        console.log("craeate", gameRoom);
        // Fetch user
        let user = await Container.get(DbService).repo(JadeUserEntity).findOneById(createdBy.id)

        if (!updating) {
            // If we're creating the room, set the creator
            gameRoom.createdBy = user;
            gameRoom.players = [user];
            gameRoom = await Container.get(DbService).repo(SCGameRoomEntity).persist(gameRoom);
            console.log("about to set g", gameRoom);
            // The creator gets put in the room
            user.setGroup(gameRoom);
        }
        else await Container.get(DbService).repo(SCGameRoomEntity).persist(gameRoom);

        await Container.get(DbService).repo(JadeUserEntity).persist(user);

        console.log("post everything")

        // prevent circular
        gameRoom.createdBy = <any>createdBy;

        if(updating) {
            this._wsGC.broadcastToRoom(gameRoom.hashId, "game-room-update", gameRoom);
        }

        return gameRoom;
    }


}