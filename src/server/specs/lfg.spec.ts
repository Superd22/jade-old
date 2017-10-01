import { SCDefaultGameModes } from './../../common/enums/star-citizen/default-game-modes.enum';
import { ISCLFGParams } from './../../common/interfaces/star-citizen/lfg-params.interface';
import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { TestBootStrap } from './0.bootstrap.spec';
import { TestShared } from './_.shared';
import { JadeLFGUserEntity } from './../entity/star-citizen/lfg-user.entity';

TestShared.commonSetUp();
describe("/sc/lfg", () => {

    describe("GET /", () => {
        it("Should list groups");
    });

    describe("PATCH /lfg-user", () => {
        it("Should not set-up an LFG on an empty user", async (done) => {
            const response = await TestBootStrap.api.patch("/sc/lfg/lfg-user");

            TestShared.apiError(response.body);
            done();
        });

        it("Should not set-up an LFG w/ no modes declared", async (done) => {
            const user = new JadeUserEntity();
            user.rsiHandle = TestShared.randomString;

            await Container.get(DbService).repo(JadeUserEntity).persist(user);

            const response = await TestBootStrap.api.patch("/sc/lfg/lfg-user")
                .set(TestShared.genTokenFromUser(user))
                .send({ foo: "bar" });

            console.log(response.body);
            TestShared.apiError(response.body);
            await Container.get(DbService).repo(JadeUserEntity).remove(user);
            done();
        });

        it("Should set-up an LFG on user w/ handle & good packet", async (done) => {
            const user = new JadeUserEntity();
            user.rsiHandle = TestShared.randomString;

            await Container.get(DbService).repo(JadeUserEntity).persist(user);

            console.log(user);

            const goodPacket: ISCLFGParams = {
                gameModes: [SCDefaultGameModes[0]],
                gameSubModes: []
            };

            const response = await TestBootStrap.api.patch("/sc/lfg/lfg-user")
                .set(TestShared.genTokenFromUser(user))
                .send(goodPacket);


            const newUser = await Container.get(DbService).repo(JadeUserEntity).findOne({ where: { id: user.id }, relations: ['lfg'] });

            expect(newUser).toBeDefined();
            expect(newUser.id).toEqual(user.id);
            expect(newUser.lfg).toBeDefined();
            
            console.log("new:",newUser);

            TestShared.apiNoError(response.body);

            done();
        });
    });

    describe("DELETE /lfg-user", () => {
        it("Should do nothing on user without LFG", async (done) => {
            const response = await TestBootStrap.api.delete("/sc/lfg/lfg-user");

            console.log(response.body);
            TestShared.apiNoError(response.body);

            done();


        });
    });
});