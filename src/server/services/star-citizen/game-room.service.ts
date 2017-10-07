import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { Container } from 'typedi';
import { DbService } from './../db.service';
import { SCGameRoomEntity } from './../../entity/star-citizen/game-room.entity';
import { Service } from 'typedi';
import { ISCGameRoom } from "../../../common/interfaces/star-citizen/group.interface";


@Service()
export class SCGameRoomService {

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
        let gameRoom: SCGameRoomEntity = await Container.get(DbService).buildNewOrGetExistingByHash(room, SCGameRoomEntity, "gameroom");

        // Fetch user
        let user = await Container.get(DbService).repo(JadeUserEntity).findOneById(createdBy.id)

        if (!gameRoom.id) {
            // If we're creating the room, set the creator
            gameRoom.createdBy = user;
            // The creator gets put in the room
            user.setGroup(gameRoom);
        }

        await Container.get(DbService).repo(SCGameRoomEntity).persist(gameRoom);
        await Container.get(DbService).repo(JadeUserEntity).persist(user);

        // prevent circular
        gameRoom.createdBy = <any>createdBy;
        return gameRoom;
    }


}