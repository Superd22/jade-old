import { SCGameRoomEntity } from './../../entity/star-citizen/game-room.entity';
import { SCDefaultGameModes } from './../../../common/enums/star-citizen/default-game-modes.enum';
import { ISCLFSearchParams } from './../../../common/interfaces/star-citizen/lf-search-params.interface';
import { Container } from 'typedi';
import { JadeUserAuthEntity } from './../../entity/user/jade-user-auth.entity';
import { JadeLFGUserEntity } from './../../entity/star-citizen/lfg-user.entity';
import { DbService } from './../../services/db.service';
import { APIResponse } from './../../services/api-response.service';
import { SCCommonService } from './../../services/star-citizen/common-sc.service';
import { ISCLFGParams } from './../../../common/interfaces/star-citizen/lfg-params.interface';
import { Delete } from 'routing-controllers';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { CurrentUser, Patch, Get, JsonController, Body, Post, Param } from 'routing-controllers';

@JsonController("/sc/lfg")
export class APISCLFGController {

    protected sc: SCCommonService = Container.get(SCCommonService);
    protected db: DbService = Container.get(DbService);

    /**
     * List all the currently active groups
     */
    @Post('/list')
    public async listGroups( @CurrentUser() user: JadeUserEntity, @Body() body: ISCLFSearchParams) {
        let where = {};

        const limit = body.limit;
        const start = body.start;

        let gameModesCondition = this.sc.getInConditionFrom(body.gameModes || [], "gameMode.id");
        let gameSubModesCondition = this.sc.getInConditionFrom(body.gameSubModes || [], "gameSubModes.id");

        // Build our query
        const search = await Container.get(DbService).repo(SCGameRoomEntity).createQueryBuilder("room")
            .leftJoinAndSelect("room.players", "players")
            .leftJoinAndSelect("room.createdBy", "createdBy")
            // Take only the game modes we want (or every gamemodes of every lfg if no condition)
            .innerJoinAndSelect("room.gameMode", "gameMode", gameModesCondition)
            // Take every game sub modes 
            .leftJoinAndSelect("room.gameSubModes", "gameSubModes")
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
     * List all the available modes / game-modes
     */
    @Get('/available-modes')
    public listAvaliableModes() {
        let newUser = new JadeUserEntity();

        newUser.rsiHandle = "Este";

        newUser.auth = new JadeUserAuthEntity();
        newUser.auth.discord_token = "sfdfsdfezr";

    }

    /**
     * Set the supplied user as looking for a group
     * 
     * @param user user to set
     * @param body param for the lfg
     */
    @Patch('/lfg-user')
    public async setUserLfg( @CurrentUser() user: JadeUserEntity, @Body() body: ISCLFGParams) {
        // Check we can
        if (!Container.get(SCCommonService).canLf(user)) return APIResponse.err("Need a handle to search for group/members");
        if (!body || !body.gameModes) return APIResponse.err("Need at least one game mode");

        user.lfg = user.lfg || new JadeLFGUserEntity();
        user.lfg = Object.assign(user.lfg, { ...body });

        await Container.get(DbService).repo(JadeUserEntity).persist(user);
        return APIResponse.send(user);
    }

    /**
     * Remove the looking for group flag of the supplied user
     * 
     * @param user user to remove lfg for
     */
    @Delete('/lfg-user')
    public async deleteUserLfg( @CurrentUser() user: JadeUserEntity) {
        if (!user.lfg) return APIResponse.send(true);
        return APIResponse.send(await Container.get(DbService).repo(JadeLFGUserEntity).remove(user.lfg));
    }
}