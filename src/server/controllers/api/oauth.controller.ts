import { APIResponse } from './../../services/api-response.service';
import { OAuthCrendetials } from './../../../common/config/oauth.conf';
import { JsonController, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';
import * as unirest from 'unirest';
import { RequestOptions } from 'http';


@JsonController("/oauth")
export class APIIdentifyController {

    @Get("/getToken/:provider/:code")
    public async getIdentifyPacket( @Param("provider") provider: oAuthProviders, @Param("code") code: string) {
        if (!OAuthCrendetials[provider]) throw APIResponse.err("provider '" + provider + "' is not recognized");

        return APIResponse.send(await this.getTokenFromCode(provider, code));
    }

    public async getTokenFromCode(provider: oAuthProviders, code: string) {
        const opts = {
            'client_id': OAuthCrendetials[provider][0],
            'client_secret': OAuthCrendetials[provider][1],
            'grant_type': 'client_credentials',
            'redirect_uri': 'https://asd.asd',
            'code': code,
        };

        console.log(opts);

        return new Promise((resolve, reject) => {
            console.log(this.getApiUrl(provider));
            unirest.post(this.getApiUrl(provider)).headers({ "Content-Type": "x-www-form-urlencoded" })
            .type('form').send(opts).end((response) => {
                console.log(response.body);
                resolve(response.body);
            });
        });

    }

    private getApiUrl(provider: oAuthProviders): string {
        switch (provider) {
            case "discord": return "https://discordapp.com/api/oauth2/token";
            case "scfr": return "";
        }
    }

}