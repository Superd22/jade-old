import { Container } from 'typedi';
import { receivedTextMessage, SpectrumLobby, aSpectrumCommand } from "spectrum-bot/lib";

export class AuthVerifyHandleCommand implements aSpectrumCommand {
    public listenerID;
    public shortCode:string = "handle (.*)";
    public callback = (message?:receivedTextMessage, lobby?:SpectrumLobby, matchs?:Array<any>) => {
        const verifCode = matchs[1];

        if(!verifCode) lobby.sendPlainTextMessage("[BOT] Veuillez utiliser le code de vérification fourni sur le site pour confirmer votre handle.");


    };
    public name = "Auth - Verify handle";
    public manual = "Displays whether or not the bot is currently up and running.";
}
