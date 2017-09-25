import { SCRoutes } from './routes/_.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomComponent } from './components/game-room/game-room.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LookingForGroupComponent } from './components/looking-for-group/looking-for-group.component';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material';
import { LfgCriteresComponent } from './components/looking-for-group/lfg-criteres/lfg-criteres.component';
import { LfgContactComponent } from './components/looking-for-group/lfg-contact/lfg-contact.component';
import { LfgGroupesComponent } from './components/looking-for-group/lfg-groupes/lfg-groupes.component';

@NgModule({
  imports: [
    CommonModule,
    MatStepperModule,
    RouterModule.forChild(SCRoutes)
  ],
  declarations: [GameRoomComponent, LandingPageComponent, LookingForGroupComponent, LfgCriteresComponent, LfgContactComponent, LfgGroupesComponent]
})
export class StarCitizenModule { }
