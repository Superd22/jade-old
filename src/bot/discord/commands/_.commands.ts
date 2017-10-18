import { DiscordCmdIsUp } from './isup/is-up.command';
import { IDiscordCommand } from './interfaces/discord-command.interface';
export const activeDiscordCommands: IDiscordCommand[] = [
    new DiscordCmdIsUp()
];