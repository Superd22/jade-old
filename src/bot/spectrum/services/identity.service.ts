import { Observable } from 'rxjs/Observable';
import { JadeUserEntity } from './../../../server/entity/user/jade-user.entity';
import { DbService } from './../../../server/services/db.service';
import { receivedTextMessage } from 'spectrum-bot/lib';
import { Service, Container } from 'typedi';

@Service()
export class SpectrumJadeIdentityService {
    constructor() { }

    /**
     * For a given message, get the identity of the guy that posted it
     */
    public async getIdentityOfMessageSender(message: receivedTextMessage): Promise<JadeUserEntity> {
        return this.getIdentityOfHandle(message.member.nickname);
    }

    /**
     * Get the identity of the user with this handle
     * @param handle 
     */
    public async getIdentityOfHandle(handle: string): Promise<JadeUserEntity> {
        const user = await Container.get(DbService).repo(JadeUserEntity).findOne({ rsiHandle: handle });

        if (user) return user;
        else return Observable.of(new JadeUserEntity()).toPromise();
    }





}