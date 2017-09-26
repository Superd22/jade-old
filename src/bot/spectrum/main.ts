import { SpectrumJadeCommands } from './commands/_.commands';
import { Spectrum } from 'spectrum-bot/lib/';
import { config } from './config/config.conf';

let bot = new Spectrum();

// Init the bot as user (you need to declare a config)
bot.initAsUser(config.username, config.password).then( (isConnected) => {
    let state = bot.getState();


    // Wait for internal state to be ready
    state.whenReady().then(() => {
        let commands = new SpectrumJadeCommands(); 

        // Get a community
        let global = state.getCommunityByName("Sibylla");
        // Get a lobby in that community
        let fr = global.getLobbyByName("test");

        // Get events from Lobby
        fr.subscribe();
    });
});
    
