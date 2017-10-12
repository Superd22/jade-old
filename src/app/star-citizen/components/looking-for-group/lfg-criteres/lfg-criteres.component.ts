import { UiService } from './../../../../common/services/ui.service';
import { ScLfService } from './../../../services/sc-lf.service';
import { SCDefaultGameModes } from './../../../../../common/enums/star-citizen/default-game-modes.enum';
import { IDisplaySCMode } from './../../../interfaces/sc-game-mode.interface';
import { IDisplaySCSubMode } from './../../../interfaces/sc-game-sub-mode.interface';
import { SCDefaultGameSubModes } from './../../../../../common/enums/star-citizen/default-game-sub-modes.enum';
import { ISCGameMode } from './../../../../../common/interfaces/star-citizen/game-mode.interface';
import { Component, OnInit } from '@angular/core';
import { ISCDefaultGameMode } from '../../../../../common/enums/game-mode.enum';
import { SCGameSubMode } from '../../../../../common/enums/game-sub-mode.enum';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';

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


  constructor(protected scLF: ScLfService, protected ui: UiService) { }

  ngOnInit() {
    this.buildExistingSelection();
  }

  /**
   * Toggle the supplied mode as selected or not.
   * @param mode 
   */
  public toggleMode(mode: IDisplaySCMode) {
    mode.selected = !mode.selected;
  }

  public submit() {
    const wasAlreadyLFG = Boolean(this.scLF.lfgParam.value);
    this.scLF.setLfg(this.selectedModes, this.selectedSubModes).subscribe((data) => {
      if (data.error) { }
      else {
        this.ui.openSnackBar(wasAlreadyLFG ? "Critères mis à jours !" : "Recherche lancée !");
      }
    });
  }


  /**
   * Builds an existing selection from the current value in the service
   */
  public buildExistingSelection() {
    this.scLF.lfgParam.subscribe((current) => {

      this.displayModes.map((gm) => gm.selected = false);
      this.displaySubModes.map(gsm => gsm.selected = false);

      if (current) {
        if (current.gameModes) current.gameModes.map((selectedGameMode) => this.displayModes.find((gm) => gm.id === selectedGameMode.id).selected = true);
        if (current.gameSubModes) current.gameSubModes.map((selectedGameSubMode) => this.displaySubModes.find((gsm) => gsm.id === selectedGameSubMode.id).selected = true);
      }

    });
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