import { ISCGameSubMode } from './../../../common/interfaces/star-citizen/game-sub-mode.interface';
import { SCGameModeEntity } from './game-mode.entity';
import { JadeUserEntity } from './../user/jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ISCDefaultGameMode } from '../../../common/enums/game-mode.enum';

@Entity()
@Index("name_per_gamemode", (subMode: SCGameSubModeEntity) => [subMode.id, subMode.gameMode], { unique: true })
export class SCGameSubModeEntity implements ISCGameSubMode {
    @PrimaryGeneratedColumn()
    id: number;

    /** name of our sub-mode */
    @Column("varchar")
    name: string;

    /** parent gamemode of this sub-mode  */
    @OneToOne(type => SCGameModeEntity)
    @JoinColumn()
    gameMode: SCGameModeEntity;

    /** if this is a custom game mode or an officla one */
    @Column("Boolean")
    custom: boolean = false;
}