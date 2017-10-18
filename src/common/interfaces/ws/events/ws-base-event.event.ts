import { WebSocketService } from './../../../../server/services/websocket.service';
import { Container } from 'typedi';
import { APIResponse } from './../../../../server/services/api-response.service';
/**
 * Base evenement that can be emited on our ws stream
 */
export abstract class IWSBaseEvent<T> {

    private _ws = Container.get(WebSocketService);

    /** name of this event */
    public abstract eventName: string;
    /** data for this event */
    public data: T;

    /**
     * @todo check if there's a way to catch a null data when we're expecting something
     * @param data 
     */
    public constructor(data?: T) {
        this.data = APIResponse.ws(data);
    }

    /**
     * Emits this event on the ws server
     * @param target the server/namespace target for this event, will default to global namespace
     */
    public emit(target?: IWSEmitter) {
        const t = target || this._ws.ws;

        (<SocketIO.Server>t).emit(this.eventName, this.data);
    }

    /**
     * Declares a callback for this event
     * @param callback the callback function
     * @param target where to listen for this event, will default to global namespace
     */
    public on(callback: (data?: T) => any, target?: IWSReceiver) {
        const t = target || this._ws.ws.sockets;
        
        return (<SocketIO.Namespace>t).on(this.eventName, callback);
    }

}

export type IWSEmitter = SocketIO.Server | SocketIO.Namespace;
export type IWSReceiver = SocketIO.Namespace | SocketIO.Socket;