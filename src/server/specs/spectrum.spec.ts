import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { Container } from 'typedi';
import { JadeUserAuthEntity } from './../entity/user/jade-user-auth.entity';
import { JWTSecret } from '../config/jwt.conf';
import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { DbService } from './../services/db.service';
import { xJadeToken } from './../../common/consts/x-jade-token.const';
import { TestBootStrap } from './0.bootstrap.spec';
import { TestShared } from './_.shared';
import * as jwt from 'jsonwebtoken';




TestShared.commonSetUp();
describe("/spectrum", () => {

    describe("PATCH /validateHandle/:handle", () => {

        it("Should not authorize with no token", async (done) => {
            const response = await TestBootStrap.api.patch("/spectrum/validateHandle/test");
            expect(response.status).toBe(403);
            done();
        });

        it("Should not authorize with a jade token alone", async (done) => {
            const t = TestShared.genJadeToken({ jadeUserId: -1 });
            const response = await TestBootStrap.api.patch("/spectrum/validateHandle/test").set(t[0], t[1]);
            expect(response.status).toBe(403);
            done();
        });


        it("Should authorize with a spectrum token", async (done) => {
            const t = TestShared.genSpectrumToken({ jadeUserId: -1 });
            const response = await TestBootStrap.api.patch("/spectrum/validateHandle/test").set(t[0], t[1]);
            expect(response.status).toBe(200);
            done();
        });

        it("Should error on no id", async (done) => {
            const t = TestShared.genSpectrumToken({});
            const j = TestShared.genJadeToken({});
            const response = await TestBootStrap.api.patch("/spectrum/validateHandle/test").set(t[0], t[1]).set(j[0], j[1]);

            TestShared.apiError(response.body);

            done();
        });

        it("Should error on non otherwised authed player", async (done) => {
            const t = TestShared.genSpectrumToken({ jadeUserId: -1 });
            const j = TestShared.genJadeToken({ jadeUserId: -1 });
            const response = await TestBootStrap.api.patch("/spectrum/validateHandle/test").set(t[0], t[1]).set(j[0], j[1]);

            TestShared.apiError(response.body);

            done();
        });


        it("Should set handle as trusted on otherwised authed player", async (done) => {

            // Create an user that is authed on other services
            const authedUser = new JadeUserEntity();
            authedUser.scfrId = 99999999;
            authedUser.discordId = "workingdiscordid";
            await Container.get(DbService).repo(JadeUserEntity).persist(authedUser);

            // Try and set his handle to something
            const t = TestShared.genSpectrumToken({ jadeUserId: authedUser.id });
            const j = TestShared.genJadeToken({ jadeUserId: authedUser.id });
            const newHandle = String(Math.floor(Math.random() * 9e15));
            const response = await TestBootStrap.api.patch("/spectrum/validateHandle/" + newHandle).set(t[0], t[1]).set(j[0], j[1]);

            // We should have no errors
            TestShared.apiNoError(response.body);

            const newUser: IJadeUser = TestShared.getReturnData(response.body);
            console.log(response.body);
            expect(newUser.rsiHandle).toBe(newHandle);
            expect(newUser.id).toBe(authedUser.id);
            expect(newUser.auth.handle_trusted).toBe(true);
            console.log("was", authedUser);

            // Remove our test user
            await Container.get(DbService).repo(JadeUserEntity).remove(authedUser);

            done();
        });
    });

});