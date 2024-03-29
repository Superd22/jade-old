import { OauthSCFRService } from './services/oauth-scfr.service';
import { AuthRoutes } from './routes/_.routes';
import { RouterModule } from '@angular/router';
import { OauthDiscordService } from './services/oauth-discord.service';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatExpansionModule, MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { JadeMaterialModule } from './../material/material.module';
import { IdentifyService } from './services/identify.service';
import { ServiceLocator } from './services/service-locator';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthboxComponent } from './components/authbox/authbox.component';
import { FormsModule } from '@angular/forms';
import { AuthRedirectComponent } from './components/auth-redirect/auth-redirect.component';

@NgModule({
  imports: [
    CommonModule,
    JadeMaterialModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule, MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    RouterModule.forChild(AuthRoutes),
  ],
  declarations: [AuthboxComponent, AuthRedirectComponent],
  exports: [AuthboxComponent],
  providers: [IdentifyService, OauthDiscordService, OauthSCFRService],
})
export class AuthModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
