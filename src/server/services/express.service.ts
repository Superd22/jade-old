import { xJadeToken } from './../../common/consts/x-jade-token.const';
import { Action } from 'routing-controllers';
import { UserRegisterService } from './user-register.service';
import { createExpressServer } from 'routing-controllers';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service, Container, ObjectType } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";

@Service()
export class ExpressService {
    private _expressServer

    public get app() { return this._expressServer; }

    public constructor() {
        this._expressServer = createExpressServer({
            currentUserChecker: async (action: Action) => {
                const token = action.request.headers[xJadeToken];
                console.log(token, action.request.headers);
                return await Container.get(UserRegisterService).findUserFromToken(token);
            },
            controllers: [
                __dirname + "/../controllers/**/**.ts"
            ]
        }).listen(3001);
    }


}