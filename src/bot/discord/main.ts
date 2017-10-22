import { DbService } from './../../server/services/db.service';
import { Container } from 'typedi';
import { DiscordCmdDispatchService } from './commands/command-dispatcher.service';
import { discordtoken } from './config/token.conf';
import * as Discord from 'discord.js';
import "reflect-metadata";

class JadeDiscordBot {
    private _bot = new Discord.Client();

    constructor() {
        const db = Container.get(DbService);
        
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




