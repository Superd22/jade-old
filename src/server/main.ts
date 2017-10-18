import { MatchMakingService } from './services/match-making/match-making.service';
import { ExpressService } from './services/express.service';
import { WebSocketService } from './services/websocket.service';
import { UserRegisterService } from './services/user-register.service';
import { JadeUserEntity } from './entity/user/jade-user.entity';
import { SCGameRoomEntity } from './entity/star-citizen/game-room.entity';
import { createExpressServer, useContainer as routeUseContainer, Action } from "routing-controllers";
import { DbService } from './services/db.service';
import "reflect-metadata";
import { Container } from "typedi";
import { useContainer as ormUseContainer } from 'typeorm';

/**
 * Main server wrapper for Jade
 */
export function launchServer() {
    ormUseContainer(Container);
    routeUseContainer(Container);
    
    const db = Container.get(DbService);
    const ex = Container.get(ExpressService);
    const ws = Container.get(WebSocketService);
    const mm = Container.get(MatchMakingService);
    
}


launchServer();

 
