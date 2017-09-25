import { JadeUserAuthEntity } from './jade-user-auth.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from "typeorm";

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

    @OneToOne(type => JadeUserAuthEntity, auth => auth.user)
    @JoinColumn()
    auth: JadeUserAuthEntity = null;
}