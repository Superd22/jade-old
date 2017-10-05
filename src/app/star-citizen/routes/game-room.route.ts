import { Routes } from '@angular/router';
import { GameRoomComponent } from '../components/game-room/game-room.component';

export const GameRoomRoutes: Routes = [
    { path: 'GameRoom/:hashId', component: GameRoomComponent }
]