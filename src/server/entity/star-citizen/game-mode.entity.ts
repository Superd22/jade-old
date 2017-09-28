import { ISCGameMode } from './../../../common/interfaces/star-citizen/game-mode.interface';
import { JadeUserEntity } from './../user/jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ISCDefaultGameMode } from '../../../common/enums/game-mode.enum';

@Entity()
export class SCGameModeEntity implements ISCGameMode {
    @PrimaryGeneratedColumn()
    id: number;

    /** name of this game mode */
    @Column("varchar")
    @Index({ unique: true })
    name: ISCDefaultGameMode;

    /** if this game mode is active */
    @Column("boolean")
    active: boolean = true;
}