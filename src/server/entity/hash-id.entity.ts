import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { AfterInsert } from 'typeorm';
import { AfterLoad } from 'typeorm';
/**
 * Describes a class 
 */
export abstract class HashIdEntity {
    protected abstract _hashModuleName;
    public id: number;
    public hashId: string;

    /**
     * Will generate uid for this entity
     */
    @AfterLoad()
    @AfterInsert()
    protected genHash() {
        this.hashId = Container.get(DbService).hashIds(this._hashModuleName).encode(this.id);
    }
}