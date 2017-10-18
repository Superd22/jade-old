import { WSEventUserLFG } from './../../../common/interfaces/ws/events/lf/user-lfg.event';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ISCLFGParams } from './../../../common/interfaces/star-citizen/lfg-params.interface';
import { Container } from 'typedi';
import { WebSocketService } from './../websocket.service';
import { Service } from 'typedi';

@Service()
export class MatchMakingService {
    private _ws = Container.get(WebSocketService);

    constructor() {

    }


}