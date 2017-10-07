import { Container } from 'typedi';
import { SCGameRoomService } from './../../services/star-citizen/game-room.service';
import { QueryParam } from 'routing-controllers';
import { ISCGameMode } from './../../../common/interfaces/star-citizen/game-mode.interface';
import { ISCGameRoom } from './../../../common/interfaces/star-citizen/group.interface';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { SCGameRoomEntity } from './../../entity/star-citizen/game-room.entity';
import { UserRegisterService } from './../../services/user-register.service';
import { ISCLFSearchParams } from './../../../common/interfaces/star-citizen/lf-search-params.interface';
import { SCDefaultGameModes } from './../../../common/enums/star-citizen/default-game-modes.enum';
import { ISCLFParams } from './../../../common/interfaces/star-citizen/lf-params.interface';
import { JadeUserAuthEntity } from './../../entity/user/jade-user-auth.entity';
import { JadeLFGUserEntity } from './../../entity/star-citizen/lfg-user.entity';
import { DbService } from './../../services/db.service';
import { APIResponse } from './../../services/api-response.service';
import { SCCommonService } from './../../services/star-citizen/common-sc.service';
import { ISCLFGParams } from './../../../common/interfaces/star-citizen/lfg-params.interface';
import { Delete } from 'routing-controllers';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { CurrentUser, Patch, Get, JsonController, Body, Post, Put } from 'routing-controllers';

@JsonController("/sc/lfm")
export class APISCLFGController {

    protected sc: SCCommonService = Container.get(SCCommonService);
    protected db: DbService = Container.get(DbService);


    /**
     * List all the members currently looking for a group
     */
    @Post('/list')
    public async listMembers( @CurrentUser() user: JadeUserEntity, @Body() body: ISCLFSearchParams) {

        let where = {};


        const limit = body.limit;
        const start = body.start;

        let gameModesCondition = this.sc.getInConditionFrom(body.gameModes || [], "gameModes.id");
        let gameSubModesCondition = this.sc.getInConditionFrom(body.gameSubModes || [], "gameSubModes.id");

        // Build our query
        const search = await Container.get(DbService).repo(JadeLFGUserEntity).createQueryBuilder("lfg")
            .leftJoinAndSelect("lfg.user", "user")
            // Take only the game modes we want (or every gamemodes of every lfg if no condition)
            .innerJoinAndSelect("lfg.gameModes", "gameModes", gameModesCondition)
            // Take every game sub modes 
            .leftJoinAndSelect("lfg.gameSubModes", "gameSubModes")
            // Filter by our sub modes condition
            .where(gameSubModesCondition)
            // limit
            .take(limit)
            // start
            .skip(start)
            .getManyAndCount();

        return APIResponse.send(search);
    }

    /**
     * Creates a game room 
     * @param user the user creating the game room
     * @param body the game room infos
     */
    @Patch("/game-room")
    public async createGameRoom( @CurrentUser() user: JadeUserEntity, @Body() room: ISCGameRoom) {
        if (!this.sc.canLf(user)) return APIResponse.err("must be authed to create a group");
        if (user.group && user.group.isActive && !room.hashId) return APIResponse.err("you already have an active group");
        if (!this.sc.userCanEditRoom(user, room)) return APIResponse.err("you don't have the rights to edit this.");


        return APIResponse.send(await Container.get(SCGameRoomService).createGameRoom(user, room));
    }

    /**
     * Deletes a game room
     * @param user 
     * @param room 
     */
    @Delete("/game-room")
    public async deleteGameRoom( @CurrentUser() user: JadeUserEntity, @Body() room: ISCGameRoom) {
        if (!this.sc.userCanEditRoom(user, room)) return APIResponse.err("you don't have the rights to edit this.");

        return APIResponse.send(await Container.get(SCGameRoomService).deleteGameRoom(room));
    }
}