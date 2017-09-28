import { ScLfService } from './services/sc-lf.service';
import { FormsModule } from '@angular/forms';
import { SCRoutes } from './routes/_.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomComponent } from './components/game-room/game-room.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LookingForGroupComponent } from './components/looking-for-group/looking-for-group.component';
import { RouterModule } from '@angular/router';
import { MatStepperModule, MatSlideToggleModule, MatChipsModule, MatInputModule, MatButtonModule, MatCardModule, MatListModule, MatExpansionModule } from '@angular/material';
import { LfgCriteresComponent } from './components/looking-for-group/lfg-criteres/lfg-criteres.component';
import { LfgContactComponent } from './components/looking-for-group/lfg-contact/lfg-contact.component';
import { LfgGroupesComponent } from './components/looking-for-group/lfg-groupes/lfg-groupes.component';
import { ScSubModeByModePipe } from './pipes/sc-sub-mode-by-mode.pipe';
import { LookingForMembersComponent } from './components/looking-for-members/looking-for-members.component';
import { LfmMembersComponent } from './components/looking-for-members/lfm-members/lfm-members.component';

@NgModule({
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    RouterModule.forChild(SCRoutes)
  ],
  providers: [ScLfService],
  declarations: [GameRoomComponent, LandingPageComponent, LookingForGroupComponent, LfgCriteresComponent, LfgContactComponent, LfgGroupesComponent, ScSubModeByModePipe, LookingForMembersComponent, LfmMembersComponent]
})
export class StarCitizenModule { }
