import { APIResponse } from './../../services/api-response.service';
import { OAuthCrendetials } from './../../../common/config/oauth.conf';
import { JsonController, Param, Body, Get, Post, Put, Delete, Patch } from "routing-controllers";
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

    /**
     * Gets an auth code from the front-end, and fetches for a token
     * @param provider the provider this code came frome
     * @param code the code we got 
     */
    public async getTokenFromCode(provider: oAuthProviders, code: string) {
        const opts = {
            'client_id': OAuthCrendetials[provider][0],
            'client_secret': OAuthCrendetials[provider][1],
            'grant_type': 'client_credentials',
            'redirect_uri': 'https://asd.asd',
            'code': code,
        };


        return new Promise((resolve, reject) => {
            unirest.post(this.getApiUrl(provider)).headers({ "Content-Type": "x-www-form-urlencoded" })
                .type('form').send(opts).end((response) => {
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

    /**
     * Validates a handle/user couple
     * @param handle 
     */
    @Patch("/rsi/validateHandle/:handle")
    private spectrumValidateHandle( @Param('handle') handle: string) {

    }

}