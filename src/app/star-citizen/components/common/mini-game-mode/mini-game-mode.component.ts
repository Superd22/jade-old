import { ISCGameMode } from './../../../../../common/interfaces/star-citizen/game-mode.interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jade-mini-game-mode',
  templateUrl: './mini-game-mode.component.html',
  styleUrls: ['./mini-game-mode.component.scss']
})
export class MiniGameModeComponent implements OnInit {

  @Input()
  public gameMode: ISCGameMode;

  constructor() { }

  ngOnInit() {
  }

}
