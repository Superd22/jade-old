import { Component } from '@angular/core';
import { JadeWsService } from './common/services/jade-ws.service';

@Component({
  selector: 'jade-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(protected ws:JadeWsService) {

  }
}
