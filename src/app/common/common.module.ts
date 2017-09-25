import { RsiApiService } from './services/rsi-api.service';
import { JadeApiService } from './services/jade-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [JadeApiService, RsiApiService],
  declarations: []
})
export class JadeCommonModule { }
