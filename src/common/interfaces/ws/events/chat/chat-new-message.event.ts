import { ISCGameRoomChatMessage } from './../../../star-citizen/game-room/chat-message.interface';
import { ISCLFGParams } from './../../../star-citizen/lfg-params.interface';
import { IWSBaseEvent } from './../ws-base-event.event';

/**
 * Event triggered on a new chat message
 */
export class WSEventChatNew extends IWSBaseEvent<ISCGameRoomChatMessage> {
    eventName: string = "chat/new";
}