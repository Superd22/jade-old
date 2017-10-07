import { RsiApiService } from './services/rsi-api.service';
import { JadeApiService } from './services/jade-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  providers: [JadeApiService, RsiApiService],
  declarations: []
})
export class JadeCommonModule { }
