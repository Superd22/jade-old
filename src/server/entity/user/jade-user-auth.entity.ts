import { JadeUserEntity } from './jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class JadeUserAuthEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => JadeUserEntity, user => user.auth)
    @JoinColumn()
    user: JadeUserEntity;

    @Column("varchar")
    scfr_token: string = "";

    @Column("varchar")
    discord_token: string = "";


    /**
     * Check if this user is actually authed
     * @return boolean
     */
    public get is_authed(): boolean {
        return Boolean(this.scfr_token || this.discord_token);
    }
}