import { OauthSCFRService } from './../../services/oauth-scfr.service';
import { OauthDiscordService } from './../../services/oauth-discord.service';
import { IJadeUser } from './../../../../common/interfaces/User/jadeUser.interface';
import { IJadeToken } from './../../../../common/interfaces/jade-token';
import { RsiApiService, IRSIDossierSummary } from './../../../common/services/rsi-api.service';
import { JadeApiService } from './../../../common/services/jade-api.service';
import { IdentifyService } from './../../services/identify.service';
import { Component, OnInit } from '@angular/core';
import { MdIconRegistry } from '@angular/material';

@Component({
  selector: 'jade-authbox',
  templateUrl: './authbox.component.html',
  styleUrls: ['./authbox.component.scss']
})
export class AuthboxComponent implements OnInit {

  /** current handle for the user */
  public currentHandle: string;
  /** current RSI profile info for the user */
  public currentDossier: IRSIDossierSummary;
  /** current authed user */
  public currentIdent: IJadeUser;

  public get currentImage(): string {
    return this.currentDossier && this.currentDossier.avatar ? this.currentDossier.avatar : this.currentIdent && this.currentIdent.rsiAvatar ? this.currentIdent.rsiAvatar : "assets/images/no-avatar.jpg";
  }

  constructor(protected identify: IdentifyService, protected api: JadeApiService,
    private rsi: RsiApiService, protected oauthDiscord: OauthDiscordService, protected oauthSCFR: OauthSCFRService) {


    // Every time we change token we wanna check a few thingies.
    identify.jadeIdentifySubject.subscribe((token) => {
      if(!token) return;
      this.currentIdent = token.jadeUser;
      this.currentHandle = token.jadeUser.rsiHandle;
      this.currentDossier = null;
    });


  }

  ngOnInit() {
    // Check our identity
    this.api.get("identify/").subscribe();
  }

  /**
   * Fetch a new handle from RSI
   */
  public goHandle() {
    this.rsi.getDossierOf(this.currentHandle).subscribe((data) => {
      this.currentDossier = data;
    });
  }

  /**
   * Confirm the selected handle as our handle
   */
  public confirmHandle() {
    if (!this.currentDossier) return;

    this.api.patch("identify/handle", { handle: this.currentDossier.handle, avatar: this.currentDossier.avatar }).subscribe((data) => {
      console.log(data);
    });
  }
}
