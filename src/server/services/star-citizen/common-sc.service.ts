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

        // Only include official sub-modes if the flag isn't set
        if (!includeCustom) where.custom = true;

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

}