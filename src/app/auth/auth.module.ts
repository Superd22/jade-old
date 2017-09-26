import { AuthRoutes } from './routes/_.routes';
import { RouterModule } from '@angular/router';
import { OauthDiscordService } from './services/oauth-discord.service';
import { MdFormFieldModule, MdInputModule, MdButtonModule, MatExpansionModule, MatCardModule, MatIconModule } from '@angular/material';
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
    MdInputModule,
    MdFormFieldModule,
    MdButtonModule,
    MatExpansionModule,
    FormsModule, MatCardModule,
    MatIconModule,
    HttpClientModule,
    RouterModule.forChild(AuthRoutes),
  ],
  declarations: [AuthboxComponent, AuthRedirectComponent],
  exports: [AuthboxComponent],
  providers: [IdentifyService, OauthDiscordService],
})
export class AuthModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
