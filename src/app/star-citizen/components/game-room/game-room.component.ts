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

  constructor(protected api: JadeApiService, protected route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this._hash = params.get("hashId");
      this.fetchGroup();
    });
  }

  public fetchGroup() {
    this.api.get<ISCGameRoom>("game-room/" + this._hash).subscribe((data) => {
      this.group = data.data;
    });
  }

}
