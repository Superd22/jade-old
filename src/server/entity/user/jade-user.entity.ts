import { ISCGameRoom } from './../../../common/interfaces/star-citizen/group.interface';
import { SCGameRoomEntity } from './../star-citizen/game-room.entity';
import { DbService } from './../../services/db.service';
import { JadeUserHandleCodeEntity } from './jade-user-handle-code.entity';
import { Container } from 'typedi';
import { JadeLFGUserEntity } from './../star-citizen/lfg-user.entity';
import { JadeUserAuthEntity } from './jade-user-auth.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';
import { HashIdEntity } from '../hash-id.entity';

@Entity()
export class JadeUserEntity extends HashIdEntity implements IJadeUser {

    protected _hashModuleName = "user";

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

    @OneToOne(type => JadeUserAuthEntity, auth => auth.user, { cascadeInsert: true, cascadeUpdate: true, cascadeRemove: true })
    auth: JadeUserAuthEntity;

    @OneToOne(type => JadeLFGUserEntity, lfg => lfg.user, { cascadeInsert: true, cascadeUpdate: true, cascadeRemove: true })
    lfg: JadeLFGUserEntity;

    @OneToOne(type => JadeUserHandleCodeEntity, handle => handle.user, { cascadeInsert: true, cascadeUpdate: true, cascadeRemove: true })
    _handleCode: JadeUserHandleCodeEntity;

    @ManyToOne(type => SCGameRoomEntity, gameroom => gameroom.players)
    group: SCGameRoomEntity;


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
        this.auth.handle_trusted = true;

        if (!this.auth) this.auth = new JadeUserAuthEntity();
        this.auth.handle_trusted = trusted;

        if (trusted) {
            // We do not need this verification code anymore.
            this.removeCodeForHandle();
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

    /**
     * Removes the LFG status for this user
     */
    public async removeLFG() {
        if (this.lfg) {
            await Container.get(DbService).repo(JadeLFGUserEntity).remove(this.lfg);
            this.lfg = null;
        }
    }

    /**
     * Set the group (active game-room) for this user
     * 
     * @param group the group we want to go to
     */
    public async setGroup(group: SCGameRoomEntity) {
        this.removeLFG();
        this.group = group;
    }

}