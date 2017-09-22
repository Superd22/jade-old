import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";


/**
 * Main db service
 */
@Service()
export class DbService {

    /** our connection watcher  */
    private _connectionSub: ReplaySubject<Connection> = new ReplaySubject(1);
    /** Subject for the current active connection */
    public get connectionSubject(): ReplaySubject<Connection> { return this._connectionSub; }
    /** async active connection object */
    public get connection(): Promise<Connection> { return this.connectionSubject.asObservable().first().toPromise(); }
    
    public constructor() {
        createConnection({
            type: "mysql",
            host: JadeMysqlConfig.host,
            port: 3306,
            username: JadeMysqlConfig.user,
            password: JadeMysqlConfig.pwd,
            database: JadeMysqlConfig.db,
            entities: [
                __dirname + "/../entity/**/**.entity.ts"
            ],
            autoSchemaSync: true,
        }).then(connection => {
            this._connectionSub.next(connection);
        }).catch(error => console.log(error));
    }



}