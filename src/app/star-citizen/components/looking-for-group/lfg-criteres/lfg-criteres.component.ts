import { ScLfService } from './../../../services/sc-lf.service';
import { SCDefaultGameModes } from './../../../../../common/enums/star-citizen/default-game-modes.enum';
import { IDisplaySCMode } from './../../../interfaces/sc-game-mode.interface';
import { IDisplaySCSubMode } from './../../../interfaces/sc-game-sub-mode.interface';
import { SCDefaultGameSubModes } from './../../../../../common/enums/star-citizen/default-game-sub-modes.enum';
import { ISCGameMode } from './../../../../../common/interfaces/star-citizen/game-mode.interface';
import { Component, OnInit } from '@angular/core';
import { ISCDefaultGameMode } from '../../../../../common/enums/game-mode.enum';
import { SCGameSubMode } from '../../../../../common/enums/game-sub-mode.enum';
import { MdChipInputEvent } from '@angular/material';

@Component({
  selector: 'jade-lfg-criteres',
  templateUrl: './lfg-criteres.component.html',
  styleUrls: ['./lfg-criteres.component.scss']
})
export class LfgCriteresComponent implements OnInit {


  private _backUpModes: ISCGameMode[] = [];
  private _backUpSubModes: IDisplaySCSubMode[] = [];

  /** all the sub modes to display */
  public displaySubModes: IDisplaySCSubMode[] = SCDefaultGameSubModes;

  /** all the modes to display */
  public displayModes: IDisplaySCMode[] = SCDefaultGameModes;

  /** currently selected modes */
  public get selectedModes(): IDisplaySCMode[] { return this.displayModes.filter((mode) => mode.selected); }

  /** currently selected sub modes */
  public get selectedSubModes(): IDisplaySCSubMode[] { return this.displaySubModes.filter((submode) => submode.selected); }


  constructor(protected scLF: ScLfService) { }

  ngOnInit() {
  }

  /**
   * Toggle the supplied mode as selected or not.
   * @param mode 
   */
  public toggleMode(mode: IDisplaySCMode) {
    mode.selected = !mode.selected;
  }

  public submit() {
    this.scLF.setLfg(this.selectedModes, this.selectedSubModes);
  }

}



export interface ISCHasGameMode {
  gameMode: ISCDefaultGameMode,
}

export interface ISCDisplayCustomSubMode extends ISCHasGameMode {
  name: string,
}

export interface ISCDisplaySubMode extends ISCHasGameMode {
  id: number,
  name: string,
  explain?: string,
  selected?: boolean,
}