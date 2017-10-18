import { ISCLFGParams } from './../../../star-citizen/lfg-params.interface';
import { IWSBaseEvent } from './../ws-base-event.event';

/**
 * Event triggered when an user starts looking for a group
 */
export class WSEventUserLFG extends IWSBaseEvent<{ userHash: string, lfg: ISCLFGParams }> {
    eventName: string = "user/lfg";
}