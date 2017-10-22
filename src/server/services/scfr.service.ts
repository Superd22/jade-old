import { DbService } from './db.service';
import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service, Container, ObjectType } from "typedi";
import { createConnection, Connection, useContainer } from "typeorm";
import { ReplaySubject } from "rxjs";
import * as unirest from 'unirest';


/**
 * Main db service
 */
@Service()
export class SCFRService {

    private _api = "https://starcitizen.fr/Forum/app.php/";

    public constructor() { }

    /**
     * Check discord identity of the user
     * @param user 
     */
    public async getIdentity(user: JadeUserEntity) {
        return new Promise((resolve) => unirest.get(this._api + "scfr-api/v1/Identify")
            .headers(this.authorizationToken(user))
            .end((response) => {
                resolve(response.body);
            })
        );
    }

    /**
     * Declares the user as no longer validly authed to this provider
     * @param user 
     */
    public async userNoLongerValid(user: JadeUserEntity) {
        user = await Container.get(DbService).repo(JadeUserEntity).findOneById(user.id, { relations: ['auth'] });

        user.scfrId = null;

        if (user.auth) user.auth.remToken("scfr");


        return await Container.get(DbService).repo(JadeUserEntity).persist(user);
    }


    private authorizationToken(user: JadeUserEntity) {
        const token = user.auth ? user.auth.scfr_token : "";

        return { 'Authorization': 'Bearer ' + token };
    }




}