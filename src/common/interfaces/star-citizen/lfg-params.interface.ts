import { ISCDefaultGameMode } from "../../enums/game-mode.enum";
import { SCGameSubMode } from "../../enums/game-sub-mode.enum";

/**
 * Describes the paramaters for flaggin an user as looking for a group
 */
export interface ISCLFGParams {
    /** the game modes we're interested in */
    gameModes: ISCDefaultGameMode[];
    /** the sub-game modes we're interested in */
    subGameModes: SCGameSubMode[];
}