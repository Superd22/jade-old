import { SCDefaultGameModes } from './default-game-modes.enum';
import { ISCGameSubMode } from './../../interfaces/star-citizen/game-sub-mode.interface';
import { ISCGameMode } from './../../interfaces/star-citizen/game-mode.interface';

export const SCDefaultGameSubModes: ISCGameSubMode[] = [
    // Arena commander
    { id: 1, gameMode: SCDefaultGameModes[0], name: "Battle Royale", custom: false },
    { id: 2, gameMode: SCDefaultGameModes[0], name: "Vol Libre", custom: false },
    { id: 3, gameMode: SCDefaultGameModes[0], name: "Course", custom: false },
    { id: 4, gameMode: SCDefaultGameModes[0], name: "Squadron Battle", custom: false },
    { id: 5, gameMode: SCDefaultGameModes[0], name: "Capture the Core", custom: false },
    { id: 6, gameMode: SCDefaultGameModes[0], name: "Vanduul Swarm", custom: false },

    // Star Marine
    { id: 7, gameMode: SCDefaultGameModes[1], name: "Elimination", custom: false },
    { id: 8, gameMode: SCDefaultGameModes[1], name: "Last Stand", custom: false },

    // Star Citizen
    { id: 9, gameMode: SCDefaultGameModes[2], name: "Univers Persistant", custom: false },
];