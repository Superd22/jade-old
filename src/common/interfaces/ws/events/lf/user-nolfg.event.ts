import { IWSBaseEvent } from './../ws-base-event.event';


/**
 * Event triggered when an user stops looking for a group
 */
export class WSEventUserNoLFG extends IWSBaseEvent<null> {
    eventName: string = "user/nolfg";
}