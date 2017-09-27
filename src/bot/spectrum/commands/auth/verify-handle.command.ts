import { JadeUserEntity } from './../../../../server/entity/user/jade-user.entity';
import { DbService } from './../../../../server/services/db.service';
import { Container } from 'typedi';
import { receivedTextMessage, SpectrumLobby, aSpectrumCommand } from "spectrum-bot/lib";

export class AuthVerifyHandleCommand implements aSpectrumCommand {
    public listenerID;
    public shortCode: string = "handle (.*)";
    public callback = async (message?: receivedTextMessage, lobby?: SpectrumLobby, matchs?: Array<any>) => {
        const verifCode = matchs[1].trim();

        if (!verifCode) lobby.sendPlainTextMessage("[BOT] Veuillez utiliser le code de vérification fourni sur le site pour confirmer votre handle.");

        const handle = message.member.nickname;

        // Get user by handle
        const user = await Container.get(DbService).repo(JadeUserEntity).findOne({
            where: { rsiHandle: message.member.nickname },
            relations: ["_handleCode", "auth"]
        });
        if (!user) lobby.sendPlainTextMessage("[BOT] Vous devez d'abord vous inscrire sur jade.");
        else if (user._handleCode.code !== verifCode) lobby.sendPlainTextMessage("[BOT] Le code de confirmation ne correspond pas.");
        else if (user.id < 0 || !user.isRegistered) lobby.sendPlainTextMessage("[BOT] Vous devez être authentifié discord/starcitizen.fr pour pouvoir valider un handle.");
        else {
            // At this point, we can set the handle for this user.
            const userRepo = Container.get(DbService).repo(JadeUserEntity);

            // First we remove the handle if he belonged to someone
            let oldUser = await userRepo.findOne({ rsiHandle: handle });
            if (oldUser) { oldUser.removeHandle(); userRepo.persist(oldUser); }

            console.log("pre persist", user);
            // Now we can set the handle to the current user
            user.setHandle(handle, true);
            console.log("pre presit new", user);
            await userRepo.persist(user);

            console.log("post persist");

            lobby.sendPlainTextMessage("[BOT] Votre handle a bien été confirmé, félicitations !");
        }

        console.log(user);
    };
    public name = "Auth - Verify handle";
    public manual = "Displays whether or not the bot is currently up and running.";
}
