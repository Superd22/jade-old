import { SCDefaultGameSubModes } from './../../../../common/enums/star-citizen/default-game-sub-modes.enum';
import { ISCLFGParams } from './../../../../common/interfaces/star-citizen/lfg-params.interface';
import { IJadeUser } from './../../../../common/interfaces/User/jadeUser.interface';
import { JadeLFGUserEntity } from './../../../../server/entity/star-citizen/lfg-user.entity';
import { SCGameRoomEntity } from './../../../../server/entity/star-citizen/game-room.entity';
import { IJadeAPIResponse } from './../../../../common/interfaces/api-response';
import { JadeUserEntity } from './../../../../server/entity/user/jade-user.entity';
import { BotJadeApiService } from './../../../common/services/bot-jade-api.service';
import { SCDefaultGameModes } from './../../../../common/enums/star-citizen/default-game-modes.enum';
import { ISCGameRoom } from './../../../../common/interfaces/star-citizen/group.interface';
import { APISCLFMController } from './../../../../server/controllers/star-citizen/looking-for-member.controller';
import { APISCLFGController } from './../../../../server/controllers/star-citizen/looking-for-group.controller';
import { DUserResHelper } from './../helper/UserResponse.helper';
import { DiscordUserIdentifyService } from './../../services/identify.service';
import { Container } from 'typedi';
import { IDiscordCommand } from './../interfaces/discord-command.interface';
import * as Discord from 'discord.js';

export class DiscordLFGCommand implements IDiscordCommand {
    public name = "Looking For Group";
    public helpText = "Indicates you're looking for a group to play with";
    public code = "lfg(?: ([^ ]*))?(?: (.*))?$";


    public async callback(message?: Discord.Message, match?: string[]) {
        const user = await Container.get(DiscordUserIdentifyService).getJadeUserFrom(message, ['lfg']);

        if (!user)
            return message.channel.send(
                DUserResHelper.userNotAuthed()
            );

        // The user just wants the run-down on his lfg
        if (user.lfg && (!match[1] && !match[2])) return message.channel.send(await this.displayLFG(user));

        let create: IJadeAPIResponse<IJadeUser>;

        create = await this.updateLFG(user, match);


        if (create.error) return message.channel.send(DUserResHelper.error("Oops, petite erreur !", create.msg));
        else {
            const lfg = create.data;

            return message.channel.send(
                await this.displayLFG(lfg)
            );
        }
    }

    public async updateLFG(user: JadeUserEntity, match: string[]) {
        const wantGameMode = match[1] || "star-citizen";

        const gameMode = SCDefaultGameModes.find((gm) => gm.name === wantGameMode);

        const packet: ISCLFGParams = {
            gameModes: [gameMode],
            gameSubModes: [],
        };

        return await Container.get(BotJadeApiService).patch<IJadeUser>("sc/lfg/lfg-user", packet, user);
    }


    public async displayLFG(user: IJadeUser) {
        const ret = DUserResHelper.success("@" + user.rsiHandle + " cherche un groupe");


        ret.setDescription("Alors, qui veux jouer avec lui ?");

        user.lfg.gameModes.map((gm) => {
            const sub = user.lfg.gameSubModes.filter(
                (gsm) => {
                    // If we have the game mode fteched
                    if (gsm.gameMode) return gsm.gameMode.id === gm.id
                    // If we're not a custom subgamemode we know what we want
                    if (gsm.custom == false) return SCDefaultGameSubModes.find((sgsm) => sgsm.id == gsm.id).gameMode.id === gm.id
                    // @todo
                    return false
                }


            ).map((gsm) => gsm.name).join(', ') || "Tout mode de jeu";
            ret.addField(gm.prettyName, sub);
        });


        return ret;
    }
}