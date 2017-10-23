import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { AfterInsert } from 'typeorm';
import { AfterLoad, BeforeInsert, BeforeUpdate } from 'typeorm';
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

    /**
     * Returns the id computed from the hash
     */
    @BeforeInsert()
    @BeforeUpdate()
    public getIdFromHash() {
        if (!this.id && this.hashId)
            this.id = Container.get(DbService).hashIds(this._hashModuleName).decode(this.hashId)[0];

        return this.id;
    }
}