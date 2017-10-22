import { UserRegisterService } from './../../../server/services/user-register.service';
import { JadeUserEntity } from './../../../server/entity/user/jade-user.entity';
import { JadeUserAuthEntity } from './../../../server/entity/user/jade-user-auth.entity';
import { DbService } from './../../../server/services/db.service';
import { Service, Container, ObjectType } from "typedi";
import { createConnection, Connection, useContainer } from "typeorm";
import * as Discord from 'discord.js';

@Service()
export class DiscordUserIdentifyService {


    public constructor() { }

    /**
     * Gets the Jade identity of the given user
     * @param message fetch the identity of the author of this message
     * @param user fetch the identity of this discord user
     */
    public async getJadeUserFrom(message: Discord.Message, relations?: (keyof JadeUserEntity)[]): Promise<JadeUserEntity>
    public async getJadeUserFrom(user: Discord.User, relations?: (keyof JadeUserEntity)[]): Promise<JadeUserEntity>
    public async getJadeUserFrom(userOrMessage: Object, relations?: (keyof JadeUserEntity)[]): Promise<JadeUserEntity> {
        let user: Discord.User = <Discord.User>userOrMessage;
        if (userOrMessage.constructor.name === Discord.Message.name) user = (<Discord.Message>userOrMessage).author;

        const search = await Container.get(DbService).repo(JadeUserEntity).findOne({ where: { discordId: user.id }, relations: relations });

        if(search && search.id) {
           return await Container.get(UserRegisterService).findUserFromId(search.id);
        }

        return null;
    }

}