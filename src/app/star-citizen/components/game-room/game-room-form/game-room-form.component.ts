import { ScLfService } from './../../../services/sc-lf.service';
import { IDisplaySCMode } from './../../../interfaces/sc-game-mode.interface';
import { SCDefaultGameModes } from './../../../../../common/enums/star-citizen/default-game-modes.enum';
import { IDisplaySCSubMode } from './../../../interfaces/sc-game-sub-mode.interface';
import { ISCGameRoom } from './../../../../../common/interfaces/star-citizen/group.interface';
import { Component, OnInit, Input } from '@angular/core';
import { SCDefaultGameSubModes } from '../../../../../common/enums/star-citizen/default-game-sub-modes.enum';

@Component({
  selector: 'jade-game-room-form',
  templateUrl: './game-room-form.component.html',
  styleUrls: ['./game-room-form.component.scss']
})
export class GameRoomFormComponent implements OnInit {

  @Input()
  public group: ISCGameRoom;

  @Input("editable")
  private _editable: boolean = false;

  /** all the sub modes to display */
  public displaySubModes: IDisplaySCSubMode[] = SCDefaultGameSubModes;

  /** all the modes to display */
  public displayModes: IDisplaySCMode[] = SCDefaultGameModes;

  /** currently selected modes */
  public get selectedMode(): IDisplaySCMode { return this.displayModes.find((mode) => mode.selected); }

  /** currently selected sub modes */
  public get selectedSubModes(): IDisplaySCSubMode[] { return this.displaySubModes.filter((submode) => submode.selected); }

  /** if this group is editable, can be overwritten by the editable input */
  public get editable(): boolean {
    return this._editable || (this.group && this.group.userCanEdit);
  }

  /** the group as expected by the back-end */
  public get submitGroup(): ISCGameRoom {
    return Object.assign({}, this.group, {
      gameMode: this.selectedMode,
      gameSubModes: this.selectedSubModes
    });
  }

  constructor(protected api: ScLfService) { }

  ngOnChanges() {
    this.computeSelected();
  }

  ngOnInit() {
    this.computeSelected();
  }

  /**
   * synchronizes our selected modes with the ones in the input group
   */
  public computeSelected() {
    // Make sure we have nothing selected
    this.displayModes.map(mode => mode.selected = false);
    this.displaySubModes.map((subMode) => subMode.selected = false);

    // Select our mode
    if (this.group.gameMode) this.displayModes.find((mode) => mode.id === this.group.gameMode.id).selected = true;

    // Select our sub-modes
    if (this.group.gameSubModes) this.group.gameSubModes.map((subMode) => this.displaySubModes.find((sm) => sm.id === subMode.id).selected = true);
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
    this.api.createGroup(this.submitGroup).subscribe((data) => {
      if (!data.error) {

      }
    });
  }

}
