import { ServiceLocator } from './services/service-locator';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthboxComponent } from './components/authbox/authbox.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [AuthboxComponent]
})
export class AuthModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
