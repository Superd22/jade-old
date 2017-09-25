import { xJadeToken } from './../../../common/consts/x-jade-token.const';
import { JadeUserEntity } from './../../entity/user/jade-user.entity';
import { APIResponse } from './../../services/api-response.service';
import { UserRegisterService } from './../../services/user-register.service';
import { Response } from "express";
import { JsonController, QueryParam, Body, Get, Post, Put, Delete, Patch, CurrentUser, Res } from "routing-controllers";

@JsonController("/identify")
export class APIIdentifyController {

    public constructor(protected userService: UserRegisterService) {

    }

    /**
     * Returns the identity for the current user
     */
    @Get("/")
    public getIdentifyPacket( @CurrentUser({ required: true }) user: JadeUserEntity, @Res() response: Response) {
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
    public async trySetHandle( @CurrentUser({ required: true }) user: JadeUserEntity, @Res() response: Response, @QueryParam("handle") handle = "") {
        if (!handle) return response.sendStatus(400).send(APIResponse.err("Le handle ne peux pas être vide"));

        try {
            const newUser = await this.userService.setUserHandle(user, handle);
            console.log(newUser);
            APIResponse.setTokenUser(response, newUser);

            return response.send(APIResponse.send(newUser));
        }
        catch (err) {
            console.log(err);
            return response.send(APIResponse.err(err));
        }

    }

}