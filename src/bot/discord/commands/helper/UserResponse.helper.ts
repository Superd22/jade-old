import * as Discord from 'discord.js';

export class DUserResHelper {

    /**
     * Builds a succcess return
     * @param rich 
     */
    public static success(rich: Discord.RichEmbed): Discord.RichEmbed
    public static success(title: string): Discord.RichEmbed
    public static success(title: string, body: string): Discord.RichEmbed
    public static success(titleOrRich, body?): Discord.RichEmbed {
        let rich = DUserResHelper.constructMsgFrom(titleOrRich, body);
        rich.setColor('GREEN');

        return rich;
    }

    /**
     * Builds an error return
     * @param rich 
     */
    public static error(rich: Discord.RichEmbed): Discord.RichEmbed
    public static error(title: string): Discord.RichEmbed
    public static error(title: string, body: string): Discord.RichEmbed
    public static error(titleOrRich, body?): Discord.RichEmbed {
        let rich = DUserResHelper.constructMsgFrom(titleOrRich, body);
        rich.setColor('RED');

        return rich;
    }

    /**
     * Builds an info return
     */
    public static info(rich: Discord.RichEmbed): Discord.RichEmbed
    public static info(title: string): Discord.RichEmbed
    public static info(title: string, body: string): Discord.RichEmbed
    public static info(titleOrRich, body?): Discord.RichEmbed {
        let rich = DUserResHelper.constructMsgFrom(titleOrRich, body);
        rich.setColor('BLUE');

        return rich;
    }

    public static userNotAuthed() {
        return DUserResHelper.error("Tu n'es pas authentifié à jade !",
            `Pour pouvoir utiliser mes services, il suffit de connecter ton compte Discord à Jade. 
            Pour ça, rien de plus simple : Clique sur ce message !`).setURL("https://discordapp.com/oauth2/authorize?response_type=code&client_id=360994842119241730&state=acs&scope=identify");
    }


    /**
     * Construct a RichEmbed from different sources
     * @param rich construct from a rich
     * @param title title of the new rich embed
     * @param body description of the new rich embed
     */
    private static constructMsgFrom(rich: Discord.RichEmbed): Discord.RichEmbed
    private static constructMsgFrom(title: string): Discord.RichEmbed
    private static constructMsgFrom(title: string, body: string): Discord.RichEmbed
    private static constructMsgFrom(richOrTitle: Discord.RichEmbed | string, body?: string): Discord.RichEmbed {
        let rich: Discord.RichEmbed;
        if (richOrTitle.constructor.name === Discord.RichEmbed.name) rich = <Discord.RichEmbed>richOrTitle;
        else {
            rich = new Discord.RichEmbed();
            rich.setTitle(richOrTitle);
            console.log(body, "hahabody");
            if (body) rich.setDescription(body);
        }

        
        rich.setImage("https://starcitizen.fr/wp-content/themes/FutureSpaceV6/images/logo.min.png");

        return rich;
    }

}