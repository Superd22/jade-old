import { DbService } from './../../services/db.service';
import { Container } from 'typedi';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { SCGameSubModeEntity } from './game-sub-mode.entity';
import { ISCGameSubMode } from './../../../common/interfaces/star-citizen/game-sub-mode.interface';
import { SCGameModeEntity } from './game-mode.entity';
import { ISCGameMode } from './../../../common/interfaces/star-citizen/game-mode.interface';
import { ISCGameRoom, ISCGroupStatus } from './../../../common/interfaces/star-citizen/group.interface';
import { JadeUserEntity } from './../user/jade-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, AfterLoad, AfterInsert } from "typeorm";
import { ISCDefaultGameMode } from "./../../../common/enums/game-mode.enum";

@Entity()
export class SCGameRoomEntity<gameModeId=number> implements ISCGameRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column("text")
    description: string;

    @ManyToOne(type => SCGameModeEntity, gameMode => gameMode.groups)
    gameMode: ISCGameMode;

    @ManyToMany(type => SCGameSubModeEntity)
    @JoinTable()
    gameSubModes: ISCGameSubMode[];

    @Column("varchar")
    status: ISCGroupStatus = "pre";

    @OneToMany(type => JadeUserEntity, user => user.group)
    players: JadeUserEntity[]

    @Column("datetime")
    createdAt = new Date();

    @ManyToMany(type => JadeUserEntity)
    @JoinTable()
    createdBy: JadeUserEntity;

    @Column("integer")
    maxPlayers: number;

    hashId: string;

    /**
     * Will generate uid for this entity
     */
    @AfterLoad()
    @AfterInsert()
    private genHash() {
        this.hashId = Container.get(DbService).hashIds.encode(this.id);
    }

    /**
     * If the current group is active
     */
    public get isActive(): boolean {
        return this.status === "pre" || this.status === "playing";
    }

}