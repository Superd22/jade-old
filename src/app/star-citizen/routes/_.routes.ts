import { GameRoomRoutes } from './game-room.route';
import { LFMRoutes } from './lfm.route';
import { LFGRoutes } from './lfg.route';
import { SCLandingPageRoutes } from "./landing-page.route";

export const SCRoutes = [...SCLandingPageRoutes, ...LFGRoutes, ...LFMRoutes, ...GameRoomRoutes];