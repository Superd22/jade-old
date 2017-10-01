import { SCGameSubModeEntity } from './game-sub-mode.entity';
import { SCGameModeEntity } from './game-mode.entity';
import { JadeUserEntity } from './../user/jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ISCDefaultGameMode } from '../../../common/enums/game-mode.enum';

@Entity()
export class JadeLFGUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /** the user we belong to */
    @OneToOne(type => JadeUserEntity, user => user.lfg)
    @JoinColumn()
    user: JadeUserEntity;

    /** the game mode we're currently looking for */
    @ManyToMany(type => SCGameModeEntity)
    @JoinTable()
    gameModes: SCGameModeEntity[];

    /** the game sub-modes we're currently looking for */
    @ManyToMany(type => SCGameSubModeEntity)
    @JoinTable()
    gameSubModes: SCGameSubModeEntity[];
}