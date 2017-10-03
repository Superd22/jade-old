import { IJadeUser } from './../User/jadeUser.interface';
import { ISCGameSubMode } from './game-sub-mode.interface';
import { ISCGameMode } from './game-mode.interface';

/**
 * Describes a group of player and their activities
 */
export interface ISCGameRoom<T=number> {
    id: number,
    title: string,
    description: string,
    gameMode: ISCGameMode<T>,
    gameSubModes: ISCGameSubMode<T>[],
    status: ISCGroupStatus,
    players: IJadeUser[],
    createdAt: any,
    createdBy: IJadeUser,
    maxPlayers: number;
    hashId: string;
}

export type ISCGroupStatus = "pre" | "playing" | "inactive";