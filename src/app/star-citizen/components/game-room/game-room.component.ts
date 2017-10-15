import { WSGameRoom } from './../../../../common/consts/ws/ws-game-room.const';
import { JadeWsService } from './../../../common/services/jade-ws.service';
import { ActivatedRoute } from '@angular/router';
import { ISCGameRoom } from './../../../../common/interfaces/star-citizen/group.interface';
import { JadeApiService } from './../../../common/services/jade-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jade-sc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {

  private _hash: string;
  private group: ISCGameRoom;

  constructor(protected api: JadeApiService, protected route: ActivatedRoute, protected ws: JadeWsService) {

    this.ws.on<ISCGameRoom>("game-room-update")
      .filter((gc) => gc.hashId === this.group.hashId)
      .subscribe((room) => this.group = room);

    this.ws.on("game-room-update-members").subscribe(() => {
      console.log("got an update!");
      this.fetchGroup()
    });

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this._hash = params.get("hashId");
      this.fetchGroup();
    });
  }

  public fetchGroup() {
    this.ws.emit("game-room/view", WSGameRoom + this._hash);

    this.api.get<ISCGameRoom>("game-room/" + this._hash).subscribe((data) => {
      this.group = data.data;
    });
  }

}
