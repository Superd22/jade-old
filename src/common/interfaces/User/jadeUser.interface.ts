import { IJadeUserHandleCode } from './jade-user-handle-code.interface';
import { IJadeUserAuth } from './jade-user-auth.interface';
export interface IJadeUser {
    /** internal db id */
    id: number;
    /** rsi unique handle identifier */
    rsiHandle: string;
    /** scfr forum unique id */
    scfrId: number;
    /** discord snowflake id */
    discordId: string;
    /** rsi avatar image */
    rsiAvatar: string;
    /** auth thingy */
    auth?: IJadeUserAuth;
    _handleCode?: IJadeUserHandleCode;
}