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

export class DiscordLFMCommand implements IDiscordCommand {
    public name = "Looking For More";
    public helpText = "Creates a group looking for more members to join";
    public code = "lf([0-9]+)?m(?: ([^ ]*))?(?: (.*))?$";


    public async callback(message?: Discord.Message, match?: string[]) {
        const user = await Container.get(DiscordUserIdentifyService).getJadeUserFrom(message, ['group']);

        if (!user)
            return message.channel.send(
                DUserResHelper.userNotAuthed()
            );

        // The user just wants the run-down on the group
        if (user.group && (!match[1] && !match[2] && !match[3])) return message.channel.send(await this.displayGroup(user.group));

        console.log("waa", match, (!match[1] && !match[2] && !match[3]));

        let create: IJadeAPIResponse<ISCGameRoom>;

        // The user wants to create a group
        if (!user.group) create = await this.createGroup(user, match);
        // Or to update his group
        else create = await this.updateGroup(user, match);


        if (create.error) return message.channel.send(DUserResHelper.error("Oops, petite erreur !", create.msg));
        else {
            const group = create.data;

            return message.channel.send(
                await this.displayGroup(Object.assign(new SCGameRoomEntity, group))
            );
        }
    }

    public async updateGroup(user: JadeUserEntity, match: string[]) {
        const newGroup: SCGameRoomEntity = Object.assign(user.group);
        const gameMode = match[2] || "star-citizen";

        // the user is trying to change the player count
        if (match[1]) newGroup.maxPlayers = Number(await newGroup.playerCount()) + Number(match[1]);
        // the user is trying to change the game-mode
        if (match[2]) newGroup.gameMode = SCDefaultGameModes.find((mode) => mode.name === gameMode);
        // the user is trying to change the title
        if (match[3]) newGroup.title = match[3];

        return await Container.get(BotJadeApiService).patch<ISCGameRoom>("sc/lfm/game-room", newGroup, user);
    }

    public async createGroup(user: JadeUserEntity, match: string[]) {
        const gameMode = match[2] || "star-citizen";

        return await Container.get(BotJadeApiService).patch<ISCGameRoom>("sc/lfm/game-room", <ISCGameRoom>{
            title: match[3] || "Groupe de " + user.rsiHandle,
            gameMode: SCDefaultGameModes.find((mode) => mode.name === gameMode),
            gameSubModes: []
        }, user);

    }

    public async displayGroup(group: SCGameRoomEntity) {
        const ret = DUserResHelper.success(group.title);

        ret.setDescription((group.description || "Tu peux ajouter une description via l'interface web"));
        ret.addField("Groupe", "[jade.starcitizen.fr/#" + group.hashId + "](http://192.168.1.25:4444/gameRoom/" + group.hashId + ")", true)
        ret.addField("Joueurs", await group.playerCount() + " / " + group.maxPlayers);

        return ret;
    }
}