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

/**
 * Used to register users 
 */
@Service()
export class UserRegisterService {
    private db: DbService = Container.get(DbService);

    public constructor() { }

    /**
     * Computes the current user from a token
     * 
     * @param token the coded X-Jade-Token  
     */
    public async findUserFromToken(token: string): Promise<IJadeUser> {
        let payload = this.getTokenData(token);

        return await this.findUserFromId(payload ? payload.jadeUserId : -1);
    }

    /**
     * Finds an user from its id
     * @param jadeUserId the id to check
     */
    public async findUserFromId(jadeUserId: number): Promise<IJadeUser> {
        const user = await this.db.repo(JadeUserEntity).findOne(
            { where: { id: jadeUserId }, relations: ['_handleCode', 'auth'] }
        );
        if (user) return user;

        return Observable.of(new JadeUserEntity()).toPromise();
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
            if (userWithHandle.isRegistered) {
                // The user that has this handle is authed, so you'd need to be him to ge this handle
                throw "handle already used by authed player";
            }

            // Whoever used this handle before didn't bother to auth, so we can assume you're the same guy.
            return userWithHandle;
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
        return await this.db.repo(JadeUserEntity).findOne({ rsiHandle: handle });
    }

    /**
     * Generate a token for 
     * @param user 
     */
    public generateTokenFor(user: IJadeUser) {

    }

}