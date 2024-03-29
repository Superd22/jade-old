import { SCCommonService } from './star-citizen/common-sc.service';
import { JadeLFGUserEntity } from './../entity/star-citizen/lfg-user.entity';
import { SCFRService } from './scfr.service';
import { DiscordService } from './discord.service';
import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { IJadeToken } from './../../common/interfaces/jade-token';
import { JWTSecret } from '../config/jwt.conf';
import { DbService } from './db.service';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service, Inject, Container } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";
import * as jwt from "jsonwebtoken";
import { Observable } from 'rxjs/Observable';
import { oAuthProviders } from '../../common/enums/oauth-providers.enum';

/**
 * Used to register users 
 */
@Service()
export class UserRegisterService {
    private db: DbService = Container.get(DbService);

    private _currentUser: JadeUserEntity;
    public get currentUser() { return this._currentUser; }


    public constructor() { }

    /**
     * Computes the current user from a token
     * 
     * @param token the coded X-Jade-Token  
     */
    public async findUserFromToken(token: string): Promise<IJadeUser> {
        let payload = this.getTokenData(token);

        return await this.findUserFromId(payload ? payload.jadeUserId : -1);;
    }

    /**
     * Finds an user from its id
     * @param jadeUserId the id to check
     */
    public async findUserFromId(jadeUserId: number): Promise<JadeUserEntity> {
        const user = await this.db.repo(JadeUserEntity).findOne(
            { where: { id: jadeUserId }, relations: ['_handleCode', 'auth', 'lfg', 'group'] }
        );
        if (user) {
            // If we're there we set the current user in order to be able to fetch the following(s)
            this._currentUser = user;

            // Check our LFG status and build it if necesserary 
            user.lfg = await Container.get(SCCommonService).getLFGOfUser(user);
            // Build group status
            user.group = await Container.get(SCCommonService).getGroupOfUser(user);

            this._currentUser = user;
            return user;
        }

        this._currentUser = await Observable.of(new JadeUserEntity()).toPromise();

        return this._currentUser;
    }

    /**
     * Extracts and verify the received token
     * @param token coded token
     * @return the decoded token
     */
    private getTokenData(token: string): IJadeToken {
        let payload: IJadeToken = null;
        try {
            payload = <any>jwt.verify(token, JWTSecret);
        }
        catch (err) {
            payload = null;
        }

        return payload;
    }


    /**
     * Helper function to grab all the providers info from provider we have auth with
     * 
     * @param user the user to check
     * @param forceUpdate wether to force the update if we already have results cached
     */
    public async setUserProvidersInfo(user: JadeUserEntity, forceUpdate?: boolean) {
        await this.setUserDiscordInfo(user, forceUpdate);
        await this.setUserSCFRInfo(user, forceUpdate);
        this.verifyUserHandleCode(user, forceUpdate);
    }

    /**
     * Makes sure a given user has an handle code if needed
     * @param user the user
     * @param forceUpdate whether to force the update of the code or not
     */
    public verifyUserHandleCode(user: JadeUserEntity, forceUpdate?: boolean) {
        if (user.rsiHandle && user.isRegistered && (!user._handleCode || forceUpdate)) user.genNewHandleCode();
    }

    /**
     * Makes sure a given user has the relevant SC.FR information, and is still authorized there.
     * @param user 
     * @param forceUpdate 
     */
    public async setUserSCFRInfo(user: JadeUserEntity, forceUpdate?: boolean) {
        // Check we have a token
        if (user.auth && user.auth.scfr_token) {
            // Check if we need to update
            if (!user.scfrId || forceUpdate) {
                const scfrId = await Container.get(SCFRService).getIdentity(user);

                // We're valid
                if (scfrId && scfrId['data'] && scfrId['data']['user_id']) {
                    // Check if someone had this id before
                    const oldUser = await Container.get(DbService).repo(JadeUserEntity).findOne({ where: { scfrId: Number(scfrId['data']['user_id']) } });
                    // Someone else had that info before, well no longer.
                    if (oldUser && oldUser.id != user.id) await Container.get(SCFRService).userNoLongerValid(oldUser);

                    // And finally update ourselves
                    user.scfrId = Number(scfrId['data']['user_id']);
                    await Container.get(DbService).repo(JadeUserEntity).persist(user);
                }
                // We're **not** valid
                else {
                    await Container.get(SCFRService).userNoLongerValid(user);
                }

            }
        }
    }

    /**
     * Makes sure a given user has the relevant Discord information and is still authorized there
     * @param user 
     * @param forceUpdate 
     */
    public async setUserDiscordInfo(user: JadeUserEntity, forceUpdate?: boolean) {
        if (user.auth && user.auth.discord_token) {
            if (!user.discordId || forceUpdate) {
                const discordId = await Container.get(DiscordService).getIdentity(user);
                // We got what we wanted
                if (discordId && discordId['username'] && discordId['id']) {

                    // Check if someone had this id before
                    const oldUser = await Container.get(DbService).repo(JadeUserEntity).findOne({ where: { discordId: discordId['id'] } });
                    // Someone else had that info before, well no longer.
                    if (oldUser && oldUser.id != user.id) await Container.get(DiscordService).userNoLongerValid(oldUser);

                    // Update ourselves.
                    user.discordId = discordId['id'];
                    Container.get(DbService).repo(JadeUserEntity).persist(user).then((test) => console.log("done", test), (rejected) => console.log(rejected));

                }
                // Turns out our token isn't worth sh**
                else {
                    await Container.get(DiscordService).userNoLongerValid(user);
                }
            }
        }

        return;
    }

    /**
     * For a given user, try to set-up his handle
     * 
     * @param user the db-user we want to modify 
     * @param handle his handle
     * @return the new user object
     * @throws if can't use this handle
     */
    public async setUserHandle(user: JadeUserEntity, handle: string) {
        if (!handle) throw "handle cannot be empty";
        const userWithHandle = await this.handleExistsInDb(handle);

        // Someone has this handle
        if (userWithHandle) {
            if (userWithHandle.auth && userWithHandle.auth.handle_trusted) {
                // The user that has this handle verified it, so you'd need to be him to get his handle
                if (userWithHandle.id === user.id) return user;
                else throw "handle already used by authed player";
            }
            else if (userWithHandle.isRegistered) {
                // The user with this handle is authed but didn't verify his handle, his loss.
                userWithHandle.removeHandle();
                await this.db.repo(JadeUserEntity).persist(userWithHandle);
            }
            else return userWithHandle; // Whoever used this handle before didn't bother to auth, so we can assume you're the same guy.
        }

        // No one has this handle, we can safely add it.
        user.setHandle(handle, false);

        // This will insert a new user if we had none, or update the current one if we were authed.
        await this.db.repo(JadeUserEntity).persist(user);

        return user;
    }

    /**
     * Checks if a given handle exists in the db
     * @param handle 
     */
    public async handleExistsInDb(handle: string): Promise<JadeUserEntity> {
        return await this.db.repo(JadeUserEntity).findOne({ where: { rsiHandle: handle }, relations: ['auth'] });
    }

    /**
     * Generate a token for 
     * @param user 
     */
    public generateTokenFor(user: IJadeUser) {

    }

}