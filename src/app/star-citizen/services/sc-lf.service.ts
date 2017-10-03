import { IJadeUserLFG } from './../../../common/interfaces/User/jade-user-lfg.interface';
import { ISCLFSearchParams } from './../../../common/interfaces/star-citizen/lf-search-params.interface';
import { ISCLFParams } from './../../../common/interfaces/star-citizen/lf-params.interface';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
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

  private _lfParam: BehaviorSubject<ISCLFParams> = new BehaviorSubject(null);

  constructor(protected api: JadeApiService) { }

  /**
   * Set LFG Status for the current user
   * @param gameModes 
   * @param subModes 
   */
  public setLfg(gameModes: ISCGameMode[], subModes: ISCGameSubMode[]) {

    const packet: ISCLFGParams = {
      gameModes: gameModes,
      gameSubModes: subModes,
    };

    this._lfParam.next(packet);

    this.api.patch("sc/lfg/lfg-user", packet).subscribe((data) => {
      console.log(data);
    });

  }

  /**
   * Removes the LFG status for the current user
   * @todo
   */
  public removeLfg() {
    this._lfParam.next(null);
  }

  /**
   * Fetch the members currently flagged as LFG
   * @param searchParams the search params to use
   * @param getAll force the getting of every LFG user
   */
  public fetchLfgMembers(searchParams?: ISCLFSearchParams, getAll?: boolean) {
    // Get everything if needed
    if (getAll && searchParams) {
      searchParams.gameModes = [];
      searchParams.gameSubModes = [];
    }

    return this.api.post<[IJadeUserLFG, number]>("sc/lfm/list", searchParams).map((data) => {
      return data;
    });

  }



}
