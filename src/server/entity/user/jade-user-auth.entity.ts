import { JadeUserEntity } from './jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from "typeorm";
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';

@Entity()
export class JadeUserAuthEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => JadeUserEntity, user => user.auth, { cascadeAll: true })
    user: JadeUserEntity;

    @Column("varchar")
    scfr_token: string = "";

    @Column("varchar")
    discord_token: string = "";

    @Column("boolean")
    handle_trusted: boolean = false;


    /**
     * Check if this user is actually authed
     * @return boolean
     */
    public get is_authed(): boolean {
        return Boolean(this.scfr_token || this.discord_token);
    }

    /**
     * Sets a token
     * @param provider 
     * @param token 
     * @param refreshToken 
     */
    public setToken(provider: oAuthProviders, token: string, refreshToken?: string) {
        if(token) this[provider+"_token"] = token;
    }
}