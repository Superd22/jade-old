import { JWTSecret } from './../config/jwt.conf';
import { JWTRSISecret } from './../../bot/spectrum/config/JWT-rsi.conf';
import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { xJadeToken } from './../../common/consts/x-jade-token.const';
import { Action } from 'routing-controllers';
import { UserRegisterService } from './user-register.service';
import { createExpressServer } from 'routing-controllers';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service, Container, ObjectType } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";
import { IJadeServerRole } from '../model/server-role.type';
import * as jwt from 'jsonwebtoken';

@Service()
export class ExpressService {
    private _expressServer

    public get app() { return this._expressServer; }

    public constructor() {
        this._expressServer = createExpressServer({
            currentUserChecker: this.currentUserChecker,
            authorizationChecker: this.authorizationChecker,
            controllers: [
                __dirname + "/../controllers/**/**.ts"
            ]
        }).listen(3001);
    }


    /**
     * Returns if the current user is authorized to perform the action that require the given roles
     * 
     * @param action the action we want to do
     * @param roles the roles we need to have to do this action
     */
    public authorizationChecker = async (action: Action, roles: IJadeServerRole[]): Promise<boolean> => {

        let authorized = true;


        for (let i = 0; (i < roles.length) && authorized; i++) {
            authorized = this.checkRoleAgainstAction(action, roles[i]);
        }

        return authorized;
    }

    private checkRoleAgainstAction(action: Action, role: IJadeServerRole) {
        const codedToken = action.request.headers[this.jadeServerAuthorizationSource(role)];

        try {
            const token = jwt.verify(codedToken, this.secretForRole(role));
            if (token) return true;
            return false;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Returns the header name in which to look for the autorization for the given role
     * @param role the role we wanna perform
     * @return name of the token we need to chcek against
     */
    private jadeServerAuthorizationSource(role: IJadeServerRole): string {
        switch (role) {
            case "spectrum":
                return "x-jade-spectrum-auth";
            default:
                return xJadeToken;
        }
    }

    /**
     * Returns the secret to use for a specific role
     * @param role 
     */
    private secretForRole(role: IJadeServerRole): string {
        switch (role) {
            case "spectrum":
                return JWTRSISecret;
            default:
                return JWTSecret;
        }
    }

    /**
     * Returns the current user performing an action
     * @param action the action currently being performed
     */
    public async currentUserChecker(action: Action): Promise<IJadeUser> {
        const token = action.request.headers[xJadeToken];
        return await Container.get(UserRegisterService).findUserFromToken(token);
    }


}