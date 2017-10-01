import { ISCGameSubMode } from './game-sub-mode.interface';
import { ISCGameMode } from './game-mode.interface';
import { ISCDefaultGameMode } from "../../enums/game-mode.enum";
import { SCGameSubMode } from "../../enums/game-sub-mode.enum";

/**
 * Describes the paramaters for flaggin an user as looking for something
 */
export interface ISCLFParams {
    /** the game modes we're interested in */
    gameModes: ISCGameMode[];
    /** the sub-game modes we're interested in */
    gameSubModes: ISCGameSubMode[];
}