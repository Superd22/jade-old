import { ISCGameMode } from './game-mode.interface';
export interface ISCGameSubMode {
    id: number;
    name: string;
    gameMode: ISCGameMode;
    custom: boolean;
}