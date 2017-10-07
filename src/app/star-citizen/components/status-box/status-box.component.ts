import { ISCGameRoom } from './../../../../common/interfaces/star-citizen/group.interface';
import { ISCLFParams } from './../../../../common/interfaces/star-citizen/lf-params.interface';
import { ScLfService } from './../../services/sc-lf.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jade-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss']
})
export class StatusBoxComponent implements OnInit {

  public lfg: ISCLFParams;
  public lfm: ISCGameRoom;

  constructor(public lf: ScLfService) {
    this.lf.lfgParam.subscribe((data) => {
      this.lfg = data;
    });

    this.lf.group.subscribe((data) => {
      this.lfm = data;
    });
  }

  ngOnInit() {
  }



}
