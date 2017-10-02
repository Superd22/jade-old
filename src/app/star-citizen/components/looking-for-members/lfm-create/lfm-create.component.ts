import { ISCGameRoom } from './../../../../../common/interfaces/star-citizen/group.interface';
import { SCDefaultGameModes } from './../../../../../common/enums/star-citizen/default-game-modes.enum';
import { IDisplaySCMode } from './../../../interfaces/sc-game-mode.interface';
import { SCDefaultGameSubModes } from './../../../../../common/enums/star-citizen/default-game-sub-modes.enum';
import { IDisplaySCSubMode } from './../../../interfaces/sc-game-sub-mode.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jade-lfm-create',
  templateUrl: './lfm-create.component.html',
  styleUrls: ['./lfm-create.component.scss']
})
export class LfmCreateComponent implements OnInit {

  /** all the sub modes to display */
  public displaySubModes: IDisplaySCSubMode[] = SCDefaultGameSubModes;

  /** all the modes to display */
  public displayModes: IDisplaySCMode[] = SCDefaultGameModes;

  /** currently selected modes */
  public get selectedModes(): IDisplaySCMode[] { return this.displayModes.filter((mode) => mode.selected); }

  /** currently selected sub modes */
  public get selectedSubModes(): IDisplaySCSubMode[] { return this.displaySubModes.filter((submode) => submode.selected); }

  /** the group object we're creating */
  public group: ISCGameRoom = <ISCGameRoom>{};


  constructor() { }

  ngOnInit() {
  }


  /**
   * Toggle which mode we want
   * @param mode the mode to toggle on
   */
  public toggleMode(mode: IDisplaySCMode) {
    this.displayModes.map((m) => m.selected = false);
    mode.selected = true;
  }

}
