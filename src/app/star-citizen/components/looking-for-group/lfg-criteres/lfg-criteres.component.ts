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

  /** mode the player wants to play */
  public selectedModes: ISCDefaultGameMode[] = [];

  public displaySubModes: ISCDisplaySubMode[] = [
    { id: SCGameSubMode.AC_BATTLE_ROYALE, gameMode: "arena-commander", name: "Battle Royale" },
    { id: SCGameSubMode.AC_FREE_FLIGHT, gameMode: "arena-commander", name: "Vol Libre" },
    { id: SCGameSubMode.AC_RACE, gameMode: "arena-commander", name: "Course" },
    { id: SCGameSubMode.AC_SQUADRON_BATTLE, gameMode: "arena-commander", name: "Squadron Battle" },
    { id: SCGameSubMode.AC_CTF, gameMode: "arena-commander", name: "Capture the Core" },
    { id: SCGameSubMode.AC_VANDUUL, gameMode: "arena-commander", name: "Vanduul Swarm" },

    { id: SCGameSubMode.SM_ELIMINIATION, gameMode: "star-marine", name: "Elimination" },
    { id: SCGameSubMode.SM_LAST_STAND, gameMode: "star-marine", name: "Last Stand" },

    { id: SCGameSubMode.SC_PU, gameMode: "star-citizen", name: "Univers Persistant" },
  ];

  public displayCustomSubModes: ISCDisplayCustomSubMode[] = [];

  constructor() { }

  ngOnInit() {
  }

  /**
   * Toggle the supplied mode as selected or not.
   * @param mode 
   */
  public toggleMode(mode: ISCDefaultGameMode) {
    const isSelected = this.selectedModes.indexOf(mode);

    // Remove if selected, append otherwise
    if (isSelected > -1) this.selectedModes.splice(isSelected, 1);
    else this.selectedModes.push(mode);
  }

  /**
   * Add a custom sub mode to the list 
   * @param event 
   */
  public addCustomSubMode(event: MdChipInputEvent) {
    let input = event.input;
    let value = event.value;

    // Add custom mode
    if ((value || '').trim()) {
      this.displayCustomSubModes.push({ name: value.trim(), gameMode: <any>input.name });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * Removes a custom sub mode from our selected list
   * @param customSubMode the sub mode to remove
   */
  public removeCustomSubMode(customSubMode: ISCDisplayCustomSubMode) {
    let index = this.displayCustomSubModes.indexOf(customSubMode);
    if (index > -1) this.displayCustomSubModes.splice(index, 1);
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