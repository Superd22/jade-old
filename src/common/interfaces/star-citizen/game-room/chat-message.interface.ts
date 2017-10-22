import { ISCGameRoom } from './../group.interface';
import { IJadeUser } from './../../User/jadeUser.interface';
export interface ISCGameRoomChatMessage {
    user?: IJadeUser;
    text: string;
    gameRoom?: ISCGameRoom;
    time?;
}