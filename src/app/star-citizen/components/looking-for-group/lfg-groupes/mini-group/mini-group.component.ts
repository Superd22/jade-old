import { ISCGameRoom } from './../../../../../../common/interfaces/star-citizen/group.interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jade-mini-group',
  templateUrl: './mini-group.component.html',
  styleUrls: ['./mini-group.component.scss']
})
export class MiniGroupComponent implements OnInit {

  @Input()
  public group: ISCGameRoom;

  constructor() { }

  ngOnInit() {
  }

}
