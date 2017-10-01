import { ISCGameSubMode } from './../star-citizen/game-sub-mode.interface';
import { ISCGameMode } from './../star-citizen/game-mode.interface';
import { IJadeUser } from './jadeUser.interface';

export interface IJadeUserLFG {
    id: number,
    gameModes: ISCGameMode[],
    gameSubModes: ISCGameSubMode[],
    user?: IJadeUser;
}