import { ISCLFGParams } from './../../star-citizen/lfg-params.interface';
import { IJadeUser } from './../../User/jadeUser.interface';
import { IWSBaseEvent } from './ws-base-event.event';

export class IWSEventIdentify extends IWSBaseEvent<{ userHash: string, lfg: ISCLFGParams }> {
    public eventName = "identify";
}