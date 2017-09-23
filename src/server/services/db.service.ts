import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service, Container, ObjectType } from "typedi";
import { createConnection, Connection, useContainer } from "typeorm";
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

    private _co: Connection;

    public repo<T>(target: ObjectType<T> | string) {
        return this._co.getRepository(target);
    }

    public constructor() {
        useContainer(Container);
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
            this._co = connection;
            this._connectionSub.next(connection);
        }).catch(error => console.log(error));
    }


}