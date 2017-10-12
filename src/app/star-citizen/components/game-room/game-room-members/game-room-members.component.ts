import { ScLfService } from './../../../services/sc-lf.service';
import { IJadeUser } from './../../../../../common/interfaces/User/jadeUser.interface';
import { ISCGameRoom } from './../../../../../common/interfaces/star-citizen/group.interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jade-game-room-members',
  templateUrl: './game-room-members.component.html',
  styleUrls: ['./game-room-members.component.scss']
})
export class GameRoomMembersComponent implements OnInit {

  @Input()
  public group: ISCGameRoom;

  public get players(): IJadeUser[] { return this.group.players; }

  constructor(protected scLF: ScLfService) { }

  ngOnInit() {
  }


  public joinGroup() {
    this.scLF.joinGroup(this.group.hashId);
  }

  public leaveGroup() {
    console.log("prout");
    this.scLF.leaveGroup();
  }

}
