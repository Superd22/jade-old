import { DbService } from './../../services/db.service';
import { JadeUserHandleCodeEntity } from './jade-user-handle-code.entity';
import { Container } from 'typedi';
import { JadeLFGUserEntity } from './../star-citizen/lfg-user.entity';
import { JadeUserAuthEntity } from './jade-user-auth.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';

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

    @OneToOne(type => JadeUserAuthEntity, auth => auth.user, { cascadeAll: true, cascadeRemove: true })
    @JoinColumn()
    auth: JadeUserAuthEntity = null;

    @OneToOne(type => JadeLFGUserEntity, lfg => lfg.user, { cascadeAll: true })
    @JoinColumn()
    lfg: JadeLFGUserEntity = null;

    @OneToOne(type => JadeUserHandleCodeEntity, handle => handle.user, { cascadeInsert: true, cascadeUpdate: true })
    @JoinColumn()
    _handleCode: JadeUserHandleCodeEntity = null;


    /**
     * Check if an user is registered one way or another
     */
    public get isRegistered(): boolean {
        return Boolean(this.discordId || this.scfrId);
    }

    /**
     * Magic setter for handle
     * @param newHandle the new handle to set
     * @param trusted if we're trusting this handle or not (i.e verified by spectrum)
     */
    public async setHandle(newHandle: string, trusted?: boolean) {
        this.rsiHandle = newHandle;

        if (trusted) {
            if (!this.auth) this.auth = new JadeUserAuthEntity();
            this.auth.handle_trusted = true;

            // We do not need this verification code anymore.
            this._handleCode = null;
        }
        // We're adding a non-trusted handle, we're gonna gen an auth code to trust this in the future
        else {
            // IF we have a code, discard it.
            this.removeCodeForHandle();

            // and create our new code
            this._handleCode = new JadeUserHandleCodeEntity();
        }
    }

    /**
     * Removes the handle for this user
     */
    public removeHandle() {
        this.removeCodeForHandle();
        this.rsiHandle = "";
        if (this.auth) this.auth.handle_trusted = false;
    }

    /**
     * Set the auth token for a given provider
     * 
     * @param provider the provider 
     * @param token the token we got
     * @param refreshToken optional refresh token
     */
    public setAuthToken(provider: oAuthProviders, token: string, refreshToken?: string) {
        if (!this.auth) this.auth = new JadeUserAuthEntity();
        this.auth.setToken(provider, token, refreshToken);
    }


    private async removeCodeForHandle() {
        if (this._handleCode) await Container.get(DbService).repo(JadeUserHandleCodeEntity).remove(this._handleCode);
    }

}