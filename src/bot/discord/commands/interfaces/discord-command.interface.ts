import * as Discord from 'discord.js';

/**
 * Describes a command for this discord bot
 */
export interface IDiscordCommand {
    /** optional helper name for this command */
    name?: string;
    /** optional helper text for this command */
    helpText?: string;
    /** callback when this command is triggered by an user  */
    callback: (message?: Discord.Message, match?: string[]) => void;
    /** code to trigger this message, without prefix. */
    code: string;
}