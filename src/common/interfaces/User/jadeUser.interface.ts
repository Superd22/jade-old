import { ISCGameRoom } from './../star-citizen/group.interface';
import { IJadeUserHandleCode } from './jade-user-handle-code.interface';
import { IJadeUserAuth } from './jade-user-auth.interface';
import { IJadeUserLFG } from './jade-user-lfg.interface';
export interface IJadeUser {
    /** internal db id */
    hashId: string;
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

    id?: number;
    lfg?: IJadeUserLFG;
    group?: ISCGameRoom;
}