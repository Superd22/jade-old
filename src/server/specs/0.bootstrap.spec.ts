import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { ExpressService } from './../services/express.service';
import { launchServer } from '../main';
import * as request from 'supertest';
import { SuperTest, Test } from 'supertest';

export class TestBootStrap {
    public static express;
    public static api: SuperTest<Test>;

    constructor() {
        launchServer();
        TestBootStrap.express = Container.get(ExpressService).app;
        TestBootStrap.api = request(TestBootStrap.express);
    }
}

new TestBootStrap();

describe("Bootstraping", () => {
    it("Should create server", () => {
        expect(TestBootStrap.express).toBeTruthy();
    });

    it("Should launch db", async (done) => {
        await Container.get(DbService).connection;

        done();
    });
});