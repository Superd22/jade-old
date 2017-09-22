import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class JadeUserEntity implements IJadeUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    @Index({ unique: true })
    scfrId: number = 0;

    @Index({ unique: true })
    @Column("varchar")
    rsiHandle: string = "";

    @Column("varchar")
    @Index({ unique: true })
    discordId: string = "";
}