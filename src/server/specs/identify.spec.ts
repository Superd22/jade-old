import { JWTSecret } from './../config/jwt.config';
import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { xJadeToken } from './../../common/consts/x-jade-token.const';
import { TestBootStrap } from './0.bootstrap.spec';
import { TestShared } from './_.shared';
import * as jwt from 'jsonwebtoken';




TestShared.commonSetUp();
describe("/identify", () => {

    describe("GET /", async () => {
        it("Should always be up", (done) => {
            TestBootStrap.api.get("/identify/").expect(200, TestShared.tellJasmine(done));
        });

        it("Should return an anonymous token on blank request", async (done) => {
            const reponse = await TestBootStrap.api.get("/identify/");
            TestShared.apiNoError(reponse.body);

            // We're anonymous in the data
            expect(TestShared.getReturnData(reponse.body)['jadeUserId']).toBe(-1);
            // And in the token
            expect(jwt.decode(reponse.header[xJadeToken])['jadeUserId']).toBe(-1);

            done();
        });

        /**
         * @todo parametrize secret for CI
         */
        it("Should return an authed user on valid auth token", async (done) => {
            // Wait for db to be loaded 
            await Container.get(DbService).connection;
            const user = await Container.get(DbService).repo(JadeUserEntity).findOne();

            // Sign ourselves
            const token = jwt.sign(<any>{ jadeUserId: user.id }, JWTSecret);
            const reponse = await TestBootStrap.api.get("/identify/").set(xJadeToken, token);

            // Check the back-end does auth us as this user
            TestShared.apiNoError(reponse.body);
            expect(TestShared.getReturnData(reponse.body)['jadeUserId']).toBe(user.id);
            expect(jwt.decode(reponse.header[xJadeToken])['jadeUserId']).toBe(user.id);


            done();
        });
    });

    describe("PATCH /handle/", () => {
        it("Should throw on empty handle", async (done) => {
            const response = await TestBootStrap.api.patch("/identify/handle");
            expect(response.status).toBe(400);
            done();
        });

        it("Should create new user on non-used handle", async (done) => {
            let ok:any = false;
            let newHandle = "";

            // Gen a non-used handle
            while (!ok) {
                newHandle = String(Math.floor(Math.random() * 9e15));
                ok = await Container.get(DbService).repo(JadeUserEntity).findOne({ rsiHandle: newHandle }) === undefined;
            }

            const response = await TestBootStrap.api.patch("/identify/handle").query({ handle: newHandle });

            // Check we have no error
            TestShared.apiNoError(response.body);

            // Check we're now an authed user
            const newUserId = Number(TestShared.getReturnData(response.body)['id']);
            
            expect(newUserId).toBeGreaterThan(-1);
            expect(newUserId).toBe(jwt.decode(response.header[xJadeToken])['jadeUserId']);

            // Remove this placeholder user from the db
            await Container.get(DbService).repo(JadeUserEntity).removeById(newUserId);
            
            done();
        });

        it("Should authenticate as the user X who own that handle if X hasn't protected it", async (done) => {

            // Create a mock user in db
            const user = new JadeUserEntity();
            user.rsiHandle = String(Math.floor(Math.random() * 9e15));
            await Container.get(DbService).repo(JadeUserEntity).persist(user);

            // Call the api
            const response = await TestBootStrap.api.patch("/identify/handle").query({ handle: user.rsiHandle });

            // Check everything
            TestShared.apiNoError(response.body);
            const newUserId = Number(TestShared.getReturnData(response.body)['id']);
            expect(newUserId).toBeGreaterThan(-1);
            expect(newUserId).toBe(jwt.decode(response.header[xJadeToken])['jadeUserId']);

            // We don't need you anymore.
            await Container.get(DbService).repo(JadeUserEntity).remove(user);

            done();
        });
    });

});