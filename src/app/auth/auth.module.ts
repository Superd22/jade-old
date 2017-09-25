import { MdFormFieldModule, MdInputModule, MdButtonModule, MatExpansionModule, MatCardModule } from '@angular/material';
import { JadeMaterialModule } from './../material/material.module';
import { IdentifyService } from './services/identify.service';
import { ServiceLocator } from './services/service-locator';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthboxComponent } from './components/authbox/authbox.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    JadeMaterialModule,
    MdInputModule,
    MdFormFieldModule,
    MdButtonModule,
    MatExpansionModule,
    FormsModule, MatCardModule,
    HttpClientModule,
  ],
  declarations: [AuthboxComponent],
  exports: [AuthboxComponent],
  providers: [IdentifyService],
})
export class AuthModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
