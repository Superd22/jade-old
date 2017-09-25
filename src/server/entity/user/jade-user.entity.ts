import { JadeLFGUserEntity } from './../star-citizen/lfg-user.entity';
import { JadeUserAuthEntity } from './jade-user-auth.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class JadeUserEntity implements IJadeUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    @Index()
    scfrId: number = 0;

    @Index({ unique: true })
    @Column("varchar")
    rsiHandle: string = "";

    @Column("varchar")
    @Index()
    discordId: string = "";

    @Column("varchar")
    rsiAvatar: string = "";

    @OneToOne(type => JadeUserAuthEntity, auth => auth.user, { cascadeAll: true })
    @JoinColumn()
    auth: JadeUserAuthEntity = null;

    @OneToOne(type => JadeLFGUserEntity, lfg => lfg.user, { cascadeAll: true })
    @JoinColumn()
    lfg: JadeLFGUserEntity = null;


}