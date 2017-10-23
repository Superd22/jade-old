import { DeepPartial } from 'typeorm/common/DeepPartial';
import { HashSecret } from './../config/hash.conf';
import { SCGameSubModeEntity } from './../entity/star-citizen/game-sub-mode.entity';
import { SCDefaultGameSubModes } from './../../common/enums/star-citizen/default-game-sub-modes.enum';
import { SCDefaultGameModes } from './../../common/enums/star-citizen/default-game-modes.enum';
import { SCGameModeEntity } from './../entity/star-citizen/game-mode.entity';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service, Container, ObjectType } from "typedi";
import { createConnection, Connection, useContainer, FindOneOptions } from "typeorm";
import { ReplaySubject } from "rxjs";
var Hashids = require('hashids');

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

    /** our hash helper */
    public hashIds(moduleName = "secret") { return new Hashids(HashSecret + moduleName, 8); }

    private _co: Connection;

    public repo<T>(target: ObjectType<T> | string) {
        return this._co.getRepository(target);
    }

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
        }).then(async (connection) => {
            this._co = connection;
            await this.populateDbWithConsts();
            this._connectionSub.next(connection);
        }).catch(error => console.log(error));

    }

    /**
     * Helper method to populate the db with everything we need
     */
    private async populateDbWithConsts() {
        await this.populateDbWithSCConsts();
    }

    /**
     * Populate the db with every sc related values
     */
    private async populateDbWithSCConsts() {
        // Populate game modes
        await this.persistConst(SCDefaultGameModes, SCGameModeEntity);
        // Populate game sub modes
        await this.persistConst(SCDefaultGameSubModes, SCGameSubModeEntity);

        return true;
    }

    /**
     * Persists object in an array
     * @param objs the objs to persists
     * @param T the type of entity they are
     */
    private async persistConst<X>(objs: X[], T: ObjectType<X>) {
        return objs.map(async (x) => {
            // We map our object to the entity, just in case we were passed something that ressembles the entity
            const newX = Object.assign(new T(), x);
            // Persist
            try { await this.repo(T).persist(newX); }
            // don't care about e, probably just means we were already in the db, which is fine.
            catch (e) { }
        });
    }

    public buildEntity<T, K>(model: T, EntityType: new () => K) {
        return <K>Object.assign(new EntityType(), model);
    }

    public async persistEntity<T>(model: T, EntityType: ObjectType<T>): Promise<T> {
        return this.repo(EntityType).persist(model);
    }


    /**
     * Helper method to transform a model with an hashId to its coresponding entity
     * @param model data model
     * @param EntityType the db entity type
     * @param hashModule the module to use for the hash
     * @param relations optional relations to fetch
     */
    public async buildNewOrGetExistingByHash<T={ hashId?: string }, DBEntity=any>(model: T, EntityType: new () => DBEntity, hashModule: string, relations?: (keyof DBEntity)[]): Promise<DBEntity> {
        // Get our id
        const id = this.hashIds(hashModule).decode(model['hashId'])[0];

        // Build our options
        const findOpt: FindOneOptions<DBEntity> = relations ? { relations: relations } : {};

        // Try and find from the db with this id
        const fromDb = await this.repo(EntityType).findOneById(id, findOpt);


        // If we didn't, no big deal, we just create a new one
        if (!fromDb) return this.buildEntity(model, EntityType);
        // we did find something from the db
        else {
            // Merge what we got with what the user wanted to change
            const entity: DBEntity = Object.assign({}, fromDb, model);
            // ... but ensure our relations override everything
            relations.map((relKey) => {
                entity[relKey] = fromDb[relKey]
            });

            return entity;
        }
    }

}