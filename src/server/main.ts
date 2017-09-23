import { UserRegisterService } from './services/user-register.service';
import { SCGameRoomTextMessageEntity } from './entity/star-citizen/game-room-text-message.entity';
import { JadeUserEntity } from './entity/user/jade-user.entity';
import { SCGameRoomEntity } from './entity/star-citizen/game-room.entity';
import { createExpressServer, useContainer, Action } from "routing-controllers";
import { DbService } from './services/db.service';
/**
 * Main server wrapper for Jade
 */

// Required for TypeORM/TypeDI/RoutingController
import "reflect-metadata";
import { Container } from "typedi";


let db = Container.get(DbService);

async function a() {
    let co = await db.connection;

    const userDb = co.getRepository(JadeUserEntity);
    const roomDb = co.getRepository(SCGameRoomEntity);


    let user = await userDb.findOne({ scfrId: 9 });

    let room = new SCGameRoomEntity();
    room.createdBy = user;
    const m = new SCGameRoomTextMessageEntity();
    m.author = user;
    m.content = "hello world!";
    room.texts = [m];

    useContainer(Container);
    const app = createExpressServer({
        currentUserChecker: async (action: Action) => {
            const token = action.request.headers['X-Jade-Token'];
            return await Container.get(UserRegisterService).findUserFromToken(token);
        },
        controllers: [
        __dirname + "/controllers/**/**.ts"
        ]
    }).listen(3001);


    userDb.persist(user);
    roomDb.persist(room);

    console.log(co);
}



a();