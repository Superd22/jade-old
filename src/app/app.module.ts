import { StarCitizenModule } from './star-citizen/star-citizen.module';
import { JadeMaterialModule } from './material/material.module';
import { JadeCommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    JadeMaterialModule,
    JadeCommonModule,
    StarCitizenModule,
    AuthModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], { enableTracing: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
