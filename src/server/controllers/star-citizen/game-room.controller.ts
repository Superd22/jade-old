import { SCGameRoomService } from './../../services/star-citizen/game-room.service';
import { APISCLFGController } from './looking-for-member.controller';
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

        await this._db.repo(SCGameRoomEntity).persist(group);
        await this._db.repo(JadeUserEntity).persist(user);

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

        // If we have no user, archive the group
        if (group.players.length === 0) {
            await Container.get(SCGameRoomService).deleteGameRoom(group);
            return APIResponse.send(true);
        }

        return APIResponse.send(group);
    }

    /**
     * Finds a group by its hashId
     * @param hash 
     */
    private async getGroupByHash(hash: string): Promise<SCGameRoomEntity> {
        return await this._db.repo(SCGameRoomEntity).findOneById(Number(this._hash.decode(hash)[0]), { relations: ['players', 'createdBy', 'gameMode', 'gameSubModes'] });
    }

}