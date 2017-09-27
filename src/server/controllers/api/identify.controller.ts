import { DbService } from './../../services/db.service';
import { Container } from 'typedi';
import { xJadeToken } from './../../../common/consts/x-jade-token.const';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { APIResponse } from './../../services/api-response.service';
import { UserRegisterService } from './../../services/user-register.service';
import { Response } from "express";
import { JsonController, QueryParam, Body, Get, Post, Put, Delete, Patch, CurrentUser, Res, BodyParam } from "routing-controllers";

@JsonController("/identify")
export class APIIdentifyController {

    public constructor(protected userService: UserRegisterService) {

    }

    /**
     * Returns the identity for the current user
     */
    @Get("/")
    public async getIdentifyPacket( @CurrentUser({ required: true }) user: JadeUserEntity, @Res() response: Response) {

        console.log("pre");
        // Ensure we have all our providers info
        await this.userService.setUserProvidersInfo(user);

        console.log("userrr", user);

        // Current user will either validate or token, or log us as anon.
        const indentity = APIResponse.setTokenUser(response, user);

        return response.send(APIResponse.send(indentity));
    }

    @Put("/Create/")
    public createRoom() {

    }

    /**
     * Tries to change the handle for the current user
     * 
     * @param user current user as authed by token 
     * @param handle 
     * @param response 
     */
    @Patch("/handle/")
    public async trySetHandle( @CurrentUser({ required: true }) user: JadeUserEntity, @Res() response: Response, @Body() body) {
        const handle = body.handle;
        if (!handle) return response.send(APIResponse.err("Le handle ne peux pas être vide"));

        try {
            // Try to set-up this user
            const newUser = await this.userService.setUserHandle(user, handle);

            // Update his avatar if need be
            if (body.avatar && body.avatar != newUser.rsiAvatar) {
                newUser.rsiAvatar = body.avatar;
                await Container.get(DbService).repo(JadeUserEntity).persist(newUser);
            }

            // We have a new ident, we send the token.
            APIResponse.setTokenUser(response, newUser);

            // And response
            return response.send(APIResponse.send(newUser));
        }
        catch (err) {
            // Something went wrong
            return response.send(APIResponse.err(err));
        }

    }

}