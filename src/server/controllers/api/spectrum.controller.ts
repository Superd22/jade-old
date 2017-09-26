import { DbService } from './../../services/db.service';
import { Container } from 'typedi';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { APIResponse } from './../../services/api-response.service';
import { OAuthCrendetials } from './../../../common/config/oauth.conf';
import { JsonController, Param, Body, Get, Post, Put, Delete, Patch, Authorized, CurrentUser } from "routing-controllers";
import { oAuthProviders } from '../../../common/enums/oauth-providers.enum';
import * as unirest from 'unirest';
import { RequestOptions } from 'http';


@JsonController("/spectrum")
export class APISpectrumController {

    /**
     * Validates a handle/user couple
     * @param handle 
     */
    @Patch("/validateHandle/:handle")
    @Authorized("spectrum")
    private async spectrumValidateHandle( @CurrentUser({ required: true }) user: JadeUserEntity, @Param('handle') handle: string): Promise<APIResponse> {
        if (!handle) return APIResponse.err("need handle");
        if (user.id < 0 || !user.isRegistered) return APIResponse.err("you need to be already otherwised authed to verify an handle");

        // At this point, we can set the handle for this user.
        const userRepo = Container.get(DbService).repo(JadeUserEntity);

        // First we remove the handle if he belonged to someone
        let oldUser = await userRepo.findOne({ rsiHandle: handle });
        if (oldUser) { oldUser.removeHandle(); userRepo.persist(oldUser); }

        // Now we can set the handle to the current user
        user.setHandle(handle, true);
        userRepo.persist(user);

        return APIResponse.send(user);
    }

}