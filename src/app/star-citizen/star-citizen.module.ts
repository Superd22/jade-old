import { ScLfService } from './services/sc-lf.service';
import { FormsModule } from '@angular/forms';
import { SCRoutes } from './routes/_.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomComponent } from './components/game-room/game-room.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LookingForGroupComponent } from './components/looking-for-group/looking-for-group.component';
import { RouterModule } from '@angular/router';
import { MatStepperModule, MatSlideToggleModule, MatChipsModule, MatInputModule, MatButtonModule, MatCardModule, MatListModule, MatExpansionModule, MatSliderModule } from '@angular/material';
import { LfgCriteresComponent } from './components/looking-for-group/lfg-criteres/lfg-criteres.component';
import { LfgContactComponent } from './components/looking-for-group/lfg-contact/lfg-contact.component';
import { ScSubModeByModePipe } from './pipes/sc-sub-mode-by-mode.pipe';
import { LookingForMembersComponent } from './components/looking-for-members/looking-for-members.component';
import { LfmMembersComponent } from './components/looking-for-members/lfm-members/lfm-members.component';
import { LfmCreateComponent } from './components/looking-for-members/lfm-create/lfm-create.component';
import { StatusBoxComponent } from './components/status-box/status-box.component';
import { LfgGroupesComponent } from './components/looking-for-group/lfg-groupes/lfg-groupes.component';
import { MiniGroupComponent } from './components/looking-for-group/lfg-groupes/mini-group/mini-group.component';
import { MiniGameModeComponent } from './components/common/mini-game-mode/mini-game-mode.component';
import { GameRoomFormComponent } from './components/game-room/game-room-form/game-room-form.component';
import { GameRoomMembersComponent } from './components/game-room/game-room-members/game-room-members.component';

@NgModule({
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    MatSliderModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    RouterModule.forChild(SCRoutes)
  ],
  providers: [ScLfService],
  exports: [StatusBoxComponent],
  declarations: [GameRoomComponent, GameRoomFormComponent, LandingPageComponent, LookingForGroupComponent, LfgCriteresComponent, LfgContactComponent,
    LfgGroupesComponent, ScSubModeByModePipe, LookingForMembersComponent, LfmMembersComponent, LfmCreateComponent, StatusBoxComponent, MiniGroupComponent, MiniGameModeComponent, GameRoomMembersComponent]
})
export class StarCitizenModule { }
