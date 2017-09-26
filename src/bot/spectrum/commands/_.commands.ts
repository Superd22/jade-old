import { aSpectrumCommand, SpectrumCommands } from 'spectrum-bot/lib';
import { AuthVerifyHandleCommand } from './auth/verify-handle.command';


export class SpectrumJadeCommands {
    // is there any better way than a static array?
    public static commands:aSpectrumCommand[] = [new AuthVerifyHandleCommand()];
    private scCommands:SpectrumCommands = new SpectrumCommands();
    public constructor() {
        console.log("Creating commands with prefix trigger: !scfr");
        this.scCommands.setPrefix("!scfr");

        SpectrumJadeCommands.commands.forEach( command => {
            console.log("registering" + command.name);
            this.scCommands.registerCommand(command);
        });
    }
}
