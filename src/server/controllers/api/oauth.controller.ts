import { DiscordService } from './../../services/discord.service';
import { DbService } from './../../services/db.service';
import { Container } from 'typedi';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { APIResponse } from './../../services/api-response.service';
import { OAuthCrendetials } from './../../../common/config/oauth.conf';
import { JsonController, Param, Body, Get, Post, Put, Delete, Patch, CurrentUser, Res } from "routing-controllers";
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';
import * as unirest from 'unirest';
import { RequestOptions } from 'http';
import { Response } from "express";


@JsonController("/oauth")
export class APIIdentifyController {

    /**
     * Get a code from a provider, fetch a token and stores it in the db
     * 
     * @param provider the provider we got the code from
     * @param code its code
     * @return the current user with new authorisation 
     */
    @Get("/getToken/:provider/:code")
    public async getIdentifyPacket( @CurrentUser() user: JadeUserEntity, @Param("provider") provider: oAuthProviders, @Param("code") code: string, @Res() response: Response) {
        if (!OAuthCrendetials[provider]) return response.send(APIResponse.err("provider '" + provider + "' is not recognized"));

        // Get our token from our provider
        const token = await this.getTokenFromCode(provider, code);

        // Update db
        await this.updateTokenFromProvider(provider, user, token);

        // Don't forget to set our token
        APIResponse.setTokenUser(response, user);

        return response.send(APIResponse.send(user));
    }

    /**
     * Updates the db with a new auth token
     * @param provider the provider that issued the token
     * @param user the user we need to update
     * @param token the new token
     */
    public async updateTokenFromProvider(provider: oAuthProviders, user: JadeUserEntity, token: any) {
        if (token && token['access_token']) {
            // Set our token
            user.setAuthToken(provider, token['access_token'], token['refresh_token']);
            // And save
            await Container.get(DbService).repo(JadeUserEntity).persist(user);
        }
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
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://192.168.1.25:4444/auth/redirect?provider=discord',
            'code': code,
        };


        return new Promise((resolve, reject) => {
            unirest.post(this.getApiUrl(provider)).headers({ "Content-Type": "application/x-www-form-urlencoded" })
                .type('form').send(opts).end((response) => {
                    console.log(response.body)
                    resolve(response.body);
                });
        });

    }


    private getApiUrl(provider: oAuthProviders): string {
        switch (provider) {
            case "discord": return "https://discordapp.com/api/v6/oauth2/token";
            case "scfr": return "https://starcitizen.fr/Forum/app.php/oauth2/v1/token";
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