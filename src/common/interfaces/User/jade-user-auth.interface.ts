import { IJadeUser } from './jadeUser.interface';
export interface IJadeUserAuth {
    scfr_token: string;
    scfr_token_refresh: string;
    discord_token: string;
    discord_token_refresh: string;
    handle_trusted: boolean;
    user?: IJadeUser;
}
