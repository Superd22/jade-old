import { SCDefaultGameModes } from './../../common/enums/star-citizen/default-game-modes.enum';
import { ISCLFGParams } from './../../common/interfaces/star-citizen/lfg-params.interface';
import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { TestBootStrap } from './0.bootstrap.spec';
import { TestShared } from './_.shared';
import { JadeLFGUserEntity } from './../entity/star-citizen/lfg-user.entity';

TestShared.commonSetUp();
describe("/sc/lfm", () => {

    describe("POST /list", () => {
        it("Should list members", async (done) => {
            const response = await TestBootStrap.api.post("/sc/lfm/list");

            TestShared.apiNoError(response.body);
            done();
        });
    });

    describe("PUT /game-room", () => {
        it("Should throw on unidentified", async (done) => {
            const response = await TestBootStrap.api.patch("/sc/lfm/game-room");

            TestShared.apiError(response.body);
            done();
        });


        it("Should throw on no LFParams", async (done) => {
            const response = await TestBootStrap.api.patch("/sc/lfm/game-room").set(TestShared.newUserAndAuth({
                rsiHandle: TestShared.randomString,
            }));

            TestShared.apiError(response.body);
            done();
        });

        it("Should create a game-room for the user with the params supplied", async (done) => {

            done();
        })
    });

});