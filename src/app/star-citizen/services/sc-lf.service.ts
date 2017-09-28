import { ISCLFGParams } from './../../../common/interfaces/star-citizen/lfg-params.interface';
import { JadeApiService } from './../../common/services/jade-api.service';
import { ISCGameSubMode } from './../../../common/interfaces/star-citizen/game-sub-mode.interface';
import { ISCGameMode } from './../../../common/interfaces/star-citizen/game-mode.interface';
import { Injectable } from '@angular/core';

/**
 * Main service for every "Looking For" actions
 */
@Injectable()
export class ScLfService {

  constructor(protected api: JadeApiService) { }

  /**
   * Set LFG Status for the current user
   * @param gameModes 
   * @param subModes 
   */
  public setLfg(gameModes: ISCGameMode[], subModes: ISCGameSubMode[]) {

    const packet: ISCLFGParams = {
      gameModes: gameModes,
      subGameModes: subModes,
    };

    this.api.patch("/sc/lfg/lfg-user", packet).subscribe((data) => {
      console.log(data);
    });
  }

}
