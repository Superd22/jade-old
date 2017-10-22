import { SCGameRoomMessage } from './../../entity/star-citizen/chat/game-room-message.entity';
import { SCGameRoomChatService } from './../../services/star-citizen/chat.service';
import { SCCommonService } from './../../services/star-citizen/common-sc.service';
import { ISCGameRoomChatMessage } from './../../../common/interfaces/star-citizen/game-room/chat-message.interface';
import { WSGameRoomService } from './../../services/ws/websocket-gameroom.service';
import { SCGameRoomService } from './../../services/star-citizen/game-room.service';
import { APISCLFMController } from './looking-for-member.controller';
import { SCGameRoomEntity } from './../../entity/star-citizen/game-room.entity';
import { DbService } from './../../services/db.service';
import { Container } from 'typedi';
import { APIResponse } from './../../services/api-response.service';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { JsonController, Param, Body, Get, Post, Put, Delete, QueryParam, CurrentUser } from "routing-controllers";

@JsonController("/game-room")
export class SCGameRoomController {

    private _hash = Container.get(DbService).hashIds("gameroom");
    private _db = Container.get(DbService);
    private _wsGC = Container.get(WSGameRoomService);

    /**
     * Get a group by its unique hash
     * @param hash unique hashId 
     */
    @Get('/:hashId')
    public async getGroup( @Param("hashId") hash: string) {
        if (!hash) return APIResponse.err("must supply a group");

        const group = await this.getGroupByHash(hash);

        return APIResponse.send(group);
    }

    /**
     * Join a game room as a player
     * @param user 
     * @param hashId 
     */
    @Put("/:hashId/player")
    public async joinGameRoom( @CurrentUser() user: JadeUserEntity, @Param("hashId") hashId: string) {
        if (!hashId) return APIResponse.err("must supply a group");

        const group = await this.getGroupByHash(hashId);
        if (group.players.length >= group.maxPlayers) return APIResponse.err("group is full");

        group.players.push(user);
        user.setGroup(group);
        this._wsGC.joinRoom(user, hashId);

        await this._db.repo(SCGameRoomEntity).persist(group);
        await this._db.repo(JadeUserEntity).persist(user);

        this._wsGC.broadcastToRoom(hashId, "game-room-update-members");

        // prevent circular
        user.group = null;

        return APIResponse.send(group);
    }

    /**
     * Leave a game room as a player
     * @param user 
     * @param hashId 
     */
    @Delete("/:hashId/player")
    public async leaveGameRoom( @CurrentUser() user: JadeUserEntity, @Param("hashId") hashId: string) {
        if (!hashId) return APIResponse.err("must supply a group");

        const group = await this.getGroupByHash(hashId);
        let id = group.players.findIndex((player) => player.id === user.id);

        if (id === -1) return APIResponse.err("user not in this group");

        group.players.splice(id, 1);
        await this._db.repo(SCGameRoomEntity).persist(group);
        this._wsGC.broadcastToRoom(hashId, "game-room-update-members");
        this._wsGC.leaveRoom(user, hashId);

        // If we have no user, archive the group
        if (group.players.length === 0) {
            await Container.get(SCGameRoomService).deleteGameRoom(group);
            return APIResponse.send(true);
        }

        return APIResponse.send(group);
    }

    /**
     * Posts a message in a given game room
     * @param user 
     * @param hashId 
     * @param message 
     */
    @Put("/:hashId/chat/")
    public async postChatMessage( @CurrentUser() user: JadeUserEntity, @Param("hashId") hashId: string, @Body() message: ISCGameRoomChatMessage) {
        if (!hashId) return APIResponse.err("must supply a group");
        if (!Container.get(SCCommonService).canLf(user)) return APIResponse.err("Need a handle to speak in group");

        message.user = user;

        return APIResponse.send(await Container.get(SCGameRoomChatService).postMessageInGameRoom(await this.getGroupByHash(hashId), message));
    }

    /**
     * Lists messages in a given room
     * @param user 
     * @param hashId 
     * @param time 
     */
    @Get("/:hashId/chat/")
    public async viewChatMessages( @CurrentUser() user: JadeUserEntity, @Param("hashId") hashId: string, @QueryParam("time") time: string) {
        if (!hashId) return APIResponse.err("must supply a group");
        const group = await this.getGroupByHash(hashId);

        const messages = await Container.get(DbService).repo(SCGameRoomMessage).createQueryBuilder("msg")
            // Get our poster
            .leftJoinAndSelect("msg.user", "user")
            // Take only the messages in our game room
            .innerJoin("msg.gameRoom", "gameRoom", "gameRoom.id=':roomId'", { roomId: group.id })
            // take only whose timestamp is above
            // .where(gameSubModesCondition)
            // limit
            .take(20)
            .getManyAndCount();

        return APIResponse.send(messages);
    }

    /**
     * Finds a group by its hashId
     * @param hash 
     */
    private async getGroupByHash(hash: string): Promise<SCGameRoomEntity> {
        return await this._db.repo(SCGameRoomEntity).findOneById(Number(this._hash.decode(hash)[0]), { relations: ['players', 'createdBy', 'gameMode', 'gameSubModes'] });
    }

}