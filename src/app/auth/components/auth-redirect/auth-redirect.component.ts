import { OauthDiscordService } from './../../services/oauth-discord.service';
import { Component, OnInit } from '@angular/core';
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
  private _provider: oAuthProviders;

  constructor(protected route: ActivatedRoute, protected discord: OauthDiscordService) {

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params);
      this._code = params.get("code");
      this._provider = <any>params.get("provider");

      console.log('awas', this);

      this.goGetToken();
    });
  }

  /**
   * Tries and get a token from the code we got
   */
  private goGetToken() {
    let call;

    this.getProviderService().get_token_from_code(this._code).subscribe();
  }


  private getProviderService(): OauthService {
    switch (this._provider) {
      case "discord": return this.discord;
    }

  }
}
