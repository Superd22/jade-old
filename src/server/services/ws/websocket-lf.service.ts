import { APIResponse } from './../api-response.service';
import { WebSocketService } from './../websocket.service';
import { Container } from 'typedi';
import { ISCLFGParams } from './../../../common/interfaces/star-citizen/lfg-params.interface';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { Service } from 'typedi';

@Service()
export class WSLFService {
    protected _ws = Container.get(WebSocketService).ws;

    constructor() { }


    /**
     * Broadcast the fact the given user is looking for a group with given criterias
     * @param user user looking for a group
     * @param lfg criterias
     */
    public brodcastUserLFGStatus(user: IJadeUser, lfg: ISCLFGParams) {
        this._ws.emit("user/lfg", APIResponse.ws(lfg));
    }

    /**
     * Broadcasts the fact the given user is no longer looking for a group
     * @param user 
     */
    public brodcastUserNoMoreLFG(user: IJadeUser) {
        this._ws.emit("user/nolfg");
    }



}