import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { IJadeToken } from './../../common/interfaces/jade-token';
import { JWTSecret } from './../config/jwt.config';
import { DbService } from './db.service';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";
import * as jwt from "jsonwebtoken";
import { Observable } from 'rxjs/Observable';

/**
 * Used to register users 
 */
@Service()
export class UserRegisterService {

    public constructor(private db: DbService) { }

    /**
     * Checks the current request to see if we find 
     */
    public findRequestInfo() {

    }

    /**
     * Computes the current user from a token
     * 
     * @param token the coded X-Jade-Token  
     */
    public async findUserFromToken(token: string): Promise<IJadeUser> {
        let payload = this.getTokenData(token);

        if (payload) {
            return await this.db.repo(JadeUserEntity).findOneById(payload.jadeUserId);
        }

        else return Observable.of({id: -1, rsiHandle: "", scfrId: 0, discordId: ""}).toPromise();
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

}