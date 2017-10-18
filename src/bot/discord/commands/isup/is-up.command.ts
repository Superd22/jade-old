import { IDiscordCommand } from './../interfaces/discord-command.interface';
import * as Discord from 'discord.js';

export class DiscordCmdIsUp implements IDiscordCommand {
    public name = "is up";
    public helpText = "checks if the bot is up";
    public code = "isUp|is up";


    public callback(message?: Discord.Message, match?: string[]) {
        message.channel.send(
            new Discord.RichEmbed().setTitle("Est-ce que je suis là ?")
            .setDescription("Evidemment que je suis là.")
            .setColor("#00AE86")
        );
    }
}