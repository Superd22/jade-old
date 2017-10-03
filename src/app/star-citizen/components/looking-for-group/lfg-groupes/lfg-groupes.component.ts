import { BehaviorSubject } from 'rxjs';
import { ISCGameRoom } from './../../../../../common/interfaces/star-citizen/group.interface';
import { ISCLFSearchParams } from './../../../../../common/interfaces/star-citizen/lf-search-params.interface';
import { JadeApiService } from './../../../../common/services/jade-api.service';
import { Component, OnInit } from '@angular/core';
import { IJadeAPICountable } from '../../../../../common/interfaces/jade-api-countable.interface';

@Component({
  selector: 'jade-lfg-groupes',
  templateUrl: './lfg-groupes.component.html',
  styleUrls: ['./lfg-groupes.component.scss']
})
export class LfgGroupesComponent implements OnInit {

  public page = 1;
  public postPerPage = 10;
  public totalItems = 1;

  public groups: ISCGameRoom[] = [];

  public get searchPacket(): ISCLFSearchParams {
    return {
      gameModes: [],
      gameSubModes: [],
      start: ((this.page - 1) * this.postPerPage),
      limit: this.postPerPage,
    };
  }

  constructor(protected api: JadeApiService) { }

  ngOnInit() {
    this.search();
  }

  /**
   * Search the groups with current critierias
   */
  public search() {
    this.api.post<IJadeAPICountable<ISCGameRoom>>("sc/lfg/list", this.searchPacket).subscribe((data) => {
      console.log("j'té");
      this.totalItems = data.data[1];
      this.groups = data.data[0];
      console.log(data[0]);
    });
  }

}
