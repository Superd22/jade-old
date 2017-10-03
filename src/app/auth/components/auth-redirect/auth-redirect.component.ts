import { OauthSCFRService } from './../../services/oauth-scfr.service';
import { OauthDiscordService } from './../../services/oauth-discord.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { oAuthProviders } from '../../../../common/enums/oauth-providers.enum';
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'jade-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrls: ['./auth-redirect.component.scss']
})
export class AuthRedirectComponent implements OnInit {

  /** the return token we got */
  private _code: string;
  /** the current provider of the code */
  public provider: oAuthProviders;
  /** error if we had any */
  private error: string = "";

  public busy: boolean = false;

  constructor(protected route: ActivatedRoute, protected discord: OauthDiscordService, protected scfr: OauthSCFRService, protected location: Location) {

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      console.log("p",params);
      this._code = params.get("code");
      this.provider = <any>params.get("provider");

      console.log('awas', this);
      this.location.replaceState('auth/redirect');
      this.goGetToken();
    });
  }

  /**
   * Tries and get a token from the code we got
   */
  private goGetToken() {
    let call;

    if (this._code && this.provider) {
      this.busy = true;
      this.getProviderService().get_token_from_code(this._code).subscribe((data) => {
        this.busy = false;
        if (data.error) this.error = data.msg;
      });
    }
  }

  public get providerLogo() {
    let logo = "";
    if(this.provider == "scfr") logo = "SCFR-logo.png";
    else logo = "Discord-Logo.svg";


    return "assets/images/"+logo;
  }


  private getProviderService(): OauthService {
    switch (this.provider) {
      case "discord": return this.discord;
      case "scfr": return this.scfr;
    }
  }
}
