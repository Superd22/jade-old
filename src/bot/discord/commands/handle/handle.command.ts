import { IJadeUser } from './../../../../common/interfaces/User/jadeUser.interface';
import { IJadeAPIResponse } from './../../../../common/interfaces/api-response';
import { APIIdentifyController } from './../../../../server/controllers/api/identify.controller';
import { DUserResHelper } from './../helper/UserResponse.helper';
import { JadeUserEntity } from './../../../../server/entity/user/jade-user.entity';
import { DiscordUserIdentifyService } from './../../services/identify.service';
import { Container } from 'typedi';
import { IDiscordCommand } from './../interfaces/discord-command.interface';
import { Response as Eresponse } from 'express';
import * as Discord from 'discord.js';

export class DiscordHandleCommand implements IDiscordCommand {
    public name = "Handle";
    public helpText = "Gerer ton handle spectrum";
    public code = "handle(?: (\\w*))?$";

    private _message: Discord.Message;

    public async callback(message?: Discord.Message, match?: string[]) {
        const user = await Container.get(DiscordUserIdentifyService).getJadeUserFrom(message, ['auth']);

        // user suplied an handle
        if (match[1]) return message.channel.send(await this.setHandle(user, match[1]));
        else return message.channel.send(this.checkHandle(user));

    }

    /**
     * Displays the status of the handle for this user
     * @param user 
     */
    private checkHandle(user: IJadeUser) {
        if (!user.rsiHandle) return DUserResHelper.info("Tu n'a pas encore déclaré de handle.",
            "c'est embarassant car sans handle RSI, tu ne peux pas rejoindre de groupe ou en créer ...");

        if (user.rsiHandle && (!user.auth || !user.auth.handle_trusted)) return DUserResHelper.info("Coucou @" + user.rsiHandle,
            "J'ai bien noté ton handle, mais il n'est pas vérifié. Passe me voir sur Spectrum le faire !");

        return DUserResHelper.success("Tout est parfait @" + user.rsiHandle, "Ton handle est enregistré ET verifié !");
    }

    /**
     * Sets the handle for this user
     * @param user 
     * @param handle 
     */
    private async setHandle(user: JadeUserEntity, handle: string) {
        const setHandle = <IJadeAPIResponse<IJadeUser>><any>(await Container.get(APIIdentifyController).trySetHandle(user, <any>({ send: (data) => data, setHeader: () => { }, setHeaders: () => { } }), { handle: handle }));

        if (setHandle.error) return DUserResHelper.error("Oops!", setHandle.msg);
        if (setHandle.data.rsiHandle) return this.checkHandle(setHandle.data);
    }
}