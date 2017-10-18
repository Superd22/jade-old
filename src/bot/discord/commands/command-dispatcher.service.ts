import { activeDiscordCommands } from './_.commands';
import { IDiscordCommand } from './interfaces/discord-command.interface';
import { botPrefixCommand } from './../../common/conf/prefix.conf';
import { Service } from 'typedi';
import * as Discord from 'discord.js';

@Service()
export class DiscordCmdDispatchService {

    private _commandMap: Map<string, IDiscordCommand> = new Map();

    public constructor() {
        activeDiscordCommands.forEach((cmd) => this.registerCommand(cmd));
    }

    public checkForCommand(message: Discord.Message) {
        // discard bot messages
        if (message.author.bot) return;

        const messageAsLower = message.content.toLocaleLowerCase();

        // Discard not a command
        if (messageAsLower.indexOf(botPrefixCommand) !== 0) return;

        console.log("me", message);

        // Check if we have a command match
        this._commandMap.forEach((cmd, key) => {
            let re = new RegExp("^" + botPrefixCommand + " " + key);
            console.log(re);
            let matches = messageAsLower.match(re);
            if (matches) {
                cmd.callback(message, matches);
                return;
            }
        });
    }

    public registerCommand(command: IDiscordCommand) {
        this._commandMap.set(command.code.toLocaleLowerCase(), command);
    }


}