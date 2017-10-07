import { ISCGameRoom } from './../../../common/interfaces/star-citizen/group.interface';
import { IdentifyService } from './../../auth/services/identify.service';
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

  private _group: BehaviorSubject<ISCGameRoom> = new BehaviorSubject(null);
  public get group(): BehaviorSubject<ISCGameRoom> { return this._group; }

  private _lfgParam: BehaviorSubject<ISCLFParams> = new BehaviorSubject(null);
  public get lfgParam(): BehaviorSubject<ISCLFParams> { return this._lfgParam; }


  constructor(protected api: JadeApiService, protected identify: IdentifyService) {

    // Subscribe to token change for lfg
    this.identify.jadeIdentifySubject.subscribe((token) => {
      if (token && token.jadeUser) {
        this._lfgParam.next(token.jadeUser.lfg);
        this._group.next(token.jadeUser.group);
      }
    });


  }

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

    this._lfgParam.next(packet);

    this.api.patch("sc/lfg/lfg-user", packet).subscribe((data) => {
      console.log(data);
    });

  }

  /**
   * Removes the LFG status for the current user
   */
  public removeLfg() {
    this.api.delete("sc/lfg/lfg-user").subscribe((data) => {
      if (!data.error) this._lfgParam.next(null);
    });
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

  /**
   * Checks if the current has rights on the given group
   * @param group the group to check against
   */
  public hasRightOnGroup(group: ISCGameRoom) {

  }

  /**
   * Creates a group, the current user will be its owner
   * @param group the group to create
   */
  public createGroup(group: ISCGameRoom) {
    return this.api.patch<ISCGameRoom>("sc/lfm/game-room", group).map((newGroup) => {

      if (!newGroup.error) this._group.next(newGroup.data);



      return newGroup;
    });
  }

  /**
   * Leave the current subscribed group
   */
  public leaveGroup() {
    const curGroup = this._group.getValue();
    if (!curGroup) return;

    this.api.delete("game-room/" + curGroup.hashId + "/player").subscribe((data) => {
      if (!data.error) this._group.next(null);
      console.log(data);
    });
  }

  /**
   * Join the given group
   * @param groupHash hashId of the group to join
   * @param group the group to join
   */
  public joinGroup(groupHash: string)
  public joinGroup(group: ISCGameRoom)
  public joinGroup(g: any) {
    if (typeof g !== typeof "abc") g = g.hashId;
    this.api.delete("game-room/" + g + "/player").subscribe((data) => {
      if (!data.error) this._group.next(null);
      console.log(data);
    });
  }

}
