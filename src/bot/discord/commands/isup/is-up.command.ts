import { DUserResHelper } from './../helper/UserResponse.helper';
import { IDiscordCommand } from './../interfaces/discord-command.interface';
import * as Discord from 'discord.js';

export class DiscordCmdIsUp implements IDiscordCommand {
    public name = "is up";
    public helpText = "checks if the bot is up";
    public code = "isUp|is up";


    public callback(message?: Discord.Message, match?: string[]) {
        message.channel.send(
            DUserResHelper.info("Est-ce que je suis là ?", "Evidemment que je suis là!")
        );
    }
}