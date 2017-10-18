import { DiscordCmdDispatchService } from './commands/command-dispatcher.service';
import { Container } from 'typedi';
import { discordtoken } from './config/token.conf';
import * as Discord from 'discord.js';

class JadeDiscordBot {
    private _bot = new Discord.Client();

    constructor() {
        this._bot.login(discordtoken);

        this._bot.on("ready", () => {
            console.log('[DISCORD] Bot ready');
        });

        this._bot.on("message", (message) => {
            Container.get(DiscordCmdDispatchService).checkForCommand(message);
        });
    }
}


new JadeDiscordBot();




