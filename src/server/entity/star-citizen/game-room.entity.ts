import { UserRegisterService } from './../../services/user-register.service';
import { Container } from 'typedi';
import { DbService } from './../../services/db.service';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { SCGameSubModeEntity } from './game-sub-mode.entity';
import { ISCGameSubMode } from './../../../common/interfaces/star-citizen/game-sub-mode.interface';
import { SCGameModeEntity } from './game-mode.entity';
import { ISCGameMode } from './../../../common/interfaces/star-citizen/game-mode.interface';
import { ISCGameRoom, ISCGroupStatus } from './../../../common/interfaces/star-citizen/group.interface';
import { JadeUserEntity } from './../user/jade-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, AfterLoad, AfterInsert, JoinColumn } from "typeorm";
import { ISCDefaultGameMode } from "./../../../common/enums/game-mode.enum";
import { HashIdEntity } from '../hash-id.entity';

@Entity()
export class SCGameRoomEntity<gameModeId=number> extends HashIdEntity implements ISCGameRoom {
    protected _hashModuleName = "gameroom";

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column("text")
    description: string = "";

    @ManyToOne(type => SCGameModeEntity, gameMode => gameMode.groups)
    gameMode: ISCGameMode;

    @ManyToMany(type => SCGameSubModeEntity)
    @JoinTable()
    gameSubModes: ISCGameSubMode[];

    @Column("varchar")
    status: ISCGroupStatus = "pre";

    @OneToMany(type => JadeUserEntity, user => user.group)
    players: JadeUserEntity[] = [];

    @Column("datetime")
    createdAt = new Date();

    @OneToOne(type => JadeUserEntity)
    @JoinColumn()
    createdBy: JadeUserEntity;

    @Column("integer")
    maxPlayers: number = 2;

    /** 
     * if the current user can edit the group, not computed by default
     * only used by front-end
     * 
     * do **NOT** use as a safety check in back-end.
     * @see currentUserCanEdit()
     */
    userCanEdit: boolean = false;


    /**
     * Check if the current user can edit this game-room
     */
    @AfterLoad()
    @AfterInsert()
    public async currentUserCanEdit(): Promise<boolean> {
        const curUser = Container.get(UserRegisterService).currentUser;
        // User is not logged-in, doesn't have any rights.
        if (!curUser || !curUser.id) {
            this.userCanEdit = false;
            return this.userCanEdit;
        }

        // Make sure we have fetched the created by.
        let checkGroup = <SCGameRoomEntity>this;
        if (!this.createdBy) checkGroup = await Container.get(DbService).repo(SCGameRoomEntity).findOneById(this.id, { relations: ['createdBy'] });

        // Check if we're the creator
        if (checkGroup.createdBy.id === curUser.id) this.userCanEdit = true;

        return this.userCanEdit;
    }

    /** the number of players currently in this group */
    public async playerCount() {
        if (!this.players) {
            const that = (await Container.get(DbService).repo(SCGameRoomEntity).findOneById(this.id, { relations: ['players'] }));
            this.players = that ? that.players : [];
        }
        return this.players ? this.players.length : 0;
    }

    /**
     * If the current group is active
     */
    public get isActive(): boolean {
        return this.status === "pre" || this.status === "playing";
    }

}