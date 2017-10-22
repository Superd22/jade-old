import { JadeWsService } from './../../../../common/services/jade-ws.service';
import { ISCGameRoomChatMessage } from './../../../../../common/interfaces/star-citizen/game-room/chat-message.interface';
import { JadeApiService } from './../../../../common/services/jade-api.service';
import { ISCGameRoom } from './../../../../../common/interfaces/star-citizen/group.interface';
import { Component, OnInit, Input } from '@angular/core';
import { IJadeAPICountable } from '../../../../../common/interfaces/jade-api-countable.interface';

@Component({
  selector: 'jade-game-room-chat',
  templateUrl: './game-room-chat.component.html',
  styleUrls: ['./game-room-chat.component.scss']
})
export class GameRoomChatComponent implements OnInit {

  @Input("group")
  public group: ISCGameRoom;
  public msgs: ISCGameRoomChatMessage[] = [];

  public typingText = "";

  constructor(protected api: JadeApiService, protected ws: JadeWsService) {
    this.ws.on<ISCGameRoomChatMessage>("chat/new").filter((chat) => chat.gameRoom.hashId === this.group.hashId).subscribe((newMsg) => {
      this.msgs.push(newMsg);
    });
  }

  ngOnInit() {
    this.fetchChat();
  }

  public fetchChat() {
    this.api.get<IJadeAPICountable<ISCGameRoomChatMessage>>("game-room/" + this.group.hashId + "/chat/").subscribe((countable) => {
      this.msgs = countable.data[0];
    });
  }

  public sendChat() {
    if (!this.typingText) return;

    const msgToSend: ISCGameRoomChatMessage = {
      text: this.typingText
    };

    this.api.put<ISCGameRoomChatMessage>("game-room/" + this.group.hashId + "/chat/", msgToSend).subscribe((msg) => {
      this.typingText = "";
    });
  }

}
