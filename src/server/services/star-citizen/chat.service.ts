import { Service } from 'typedi';
import { WSEventChatNew } from './../../../common/interfaces/ws/events/chat/chat-new-message.event';
import { WSGameRoomService } from './../ws/websocket-gameroom.service';
import { Container } from 'typedi';
import { SCGameRoomMessage } from './../../entity/star-citizen/chat/game-room-message.entity';
import { DbService } from './../db.service';
import { ISCGameRoomChatMessage } from './../../../common/interfaces/star-citizen/game-room/chat-message.interface';
import { ISCGameRoom } from './../../../common/interfaces/star-citizen/group.interface';

@Service()
export class SCGameRoomChatService {
    constructor() { }

    /**
     * Posts a message in a given game room
     * @param gameRoom the game-room in which to post
     * @param message the message to post
     */
    public async postMessageInGameRoom(gameRoom: ISCGameRoom, message: ISCGameRoomChatMessage): Promise<ISCGameRoomChatMessage> {
        const messageToPost = Object.assign(new SCGameRoomMessage(), message);
        messageToPost.gameRoom = gameRoom;

        await Container.get(DbService).repo(SCGameRoomMessage).persist(messageToPost);
        await Container.get(WSGameRoomService).broadcastToRoom(gameRoom.hashId, new WSEventChatNew(messageToPost));

        return message;
    }
}