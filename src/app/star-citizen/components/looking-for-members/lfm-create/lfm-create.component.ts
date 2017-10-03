import { JadeApiService } from './../../../../common/services/jade-api.service';
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
  public get selectedMode(): IDisplaySCMode { return this.displayModes.find((mode) => mode.selected); }

  /** currently selected sub modes */
  public get selectedSubModes(): IDisplaySCSubMode[] { return this.displaySubModes.filter((submode) => submode.selected); }

  /** the group object we're creating */
  public group: ISCGameRoom = <ISCGameRoom>{};

  /** group object as expected by the back-end */
  public get groupSend(): ISCGameRoom {
    return Object.assign({}, this.group, {
      gameMode: this.selectedMode,
      subGameMode: this.selectedSubModes
    });
  }

  /** if it is a new group or an existing one */
  public get isNewGroup(): boolean { return Boolean(this.group.id >= 0); }


  constructor(protected api: JadeApiService) { }

  ngOnInit() {
  }


  /**
   * Toggle which mode we want
   * @param mode the mode to toggle on
   */
  public toggleMode(mode: IDisplaySCMode) {
    // Unselect every mods
    this.displayModes.map((m) => m.selected = false);
    // Unselect every wrongly selected submodes
    this.selectedSubModes.map((sm) => { if (sm.gameMode.id !== mode.id) sm.selected = false });
    // select this mode
    mode.selected = true;
  }

  /**
   * Send group to back-end
   */
  public submit() {
    this.api.patch<ISCGameRoom>("sc/lfm/game-room", this.groupSend).subscribe((newGroup) => {
      console.log(newGroup);
    });
  }

}
