import { DiscordLFGCommand } from './lfg/lfg.command';
import { DiscordHandleCommand } from './handle/handle.command';
import { DiscordLFMCommand } from './lfm/lfm.command';
import { DiscordCmdIsUp } from './isup/is-up.command';
import { IDiscordCommand } from './interfaces/discord-command.interface';
export const activeDiscordCommands: IDiscordCommand[] = [
    new DiscordCmdIsUp(),
    new DiscordLFMCommand(),
    new DiscordHandleCommand(),
    new DiscordLFGCommand(),
];