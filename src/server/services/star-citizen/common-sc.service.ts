import { SCGameRoomEntity } from './../../entity/star-citizen/game-room.entity';
import { ISCGameRoom } from './../../../common/interfaces/star-citizen/group.interface';
import { JadeLFGUserEntity } from './../../entity/star-citizen/lfg-user.entity';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { SCGameModeEntity } from './../../entity/star-citizen/game-mode.entity';
import { SCGameSubModeEntity } from './../../entity/star-citizen/game-sub-mode.entity';
import { DbService } from './../db.service';
import { Service, Container } from 'typedi';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Service()
export class SCCommonService {

    /** repo of submodes */
    private _subModeRepo: Repository<SCGameSubModeEntity>;
    /** repo of modes */
    private _modeRepo: Repository<SCGameModeEntity>;

    public constructor() {
        this._subModeRepo = Container.get(DbService).repo(SCGameSubModeEntity);
        this._modeRepo = Container.get(DbService).repo(SCGameModeEntity);
    }


    /**
     * Fetch sub modes in the db
     * @param includeInactive include sub-modes that belong to inactive modes
     * @param includeCustom include custom sub-modes
     * @return array of matching game sub modes
     */
    public async getSubModes(includeInactive?: boolean, includeCustom?: boolean): Promise<SCGameSubModeEntity[]> {
        let where: DeepPartial<SCGameSubModeEntity> = {};

        // Only include active game modes if the flag isn't set
        if (!includeInactive) where.gameMode = { active: true };

        // Only include official sub-modes if the flag is set
        if (includeCustom) where.custom = true;

        // Get what we want
        const subs = await this._subModeRepo.find({ where: where, relations: ['gameMode'] });

        return subs;
    }

    /**
     * Fetch all modes in the db
     * @param includeInactive include modes that are inactive
     * @return array of matching modes
     */
    public async getModes(includeInactive?: boolean): Promise<SCGameModeEntity[]> {
        let where: Partial<SCGameModeEntity> = {};

        // Include only active game modes if the flag isn't set
        if (!includeInactive) where.active = true;

        const modes = await this._modeRepo.find({ where: where });
        return modes;
    }

    /**
     * Check if an user can Look for group/members
     * @param user the user to check against
     */
    public canLf(user: IJadeUser) {
        // can't search if we don't have an handle.
        return Boolean(user.id >= 0 && user.rsiHandle);
    }

    /**
     * Get the full LFG packet of an user
     * @param user the user to fetch for
     */
    public async getLFGOfUser(user: IJadeUser) {
        return await Container.get(DbService).repo(JadeLFGUserEntity).findOne({ where: { user: user.id }, relations: ["gameModes", "gameSubModes"] });
    }

    /**
     * Check if the user can edit a room
     * @param user the user to check against
     * @param room the room to check against
     */
    public async userCanEditRoom(user: IJadeUser, room: ISCGameRoom): Promise<boolean> {
        if (!this.canLf(user)) return false;
        // Room doesn't exist, no need to check
        if (!room.id) return true;
        // User is not logged in
        if (!user.id) return false;

        let dbRoom = await Container.get(DbService).repo(SCGameRoomEntity).findOneById(room.id, { relations: ['createdBy'] });

        return dbRoom.createdBy.id === user.id;
    }


    /**
     * Returns the sql IN clause for a given collection of object
     * @param collection the collection with ids
     * @param column the column name to check against
     */
    public getInConditionFrom(collection?: { id: number }[], column?: string): string {
        if (!collection || collection.length <= 0) return "";
        else return column + " IN (" + collection.map((item) => item.id).join(",") + ")";
    }
}