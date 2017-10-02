import { ISCGameMode } from './game-mode.interface';

export interface ISCGameSubMode<T=number> {
    id: number;
    name: string;
    gameMode: ISCGameMode<T>;
    custom: boolean;
}