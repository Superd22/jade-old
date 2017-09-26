import { ISCDisplaySubMode, ISCHasGameMode } from './../components/looking-for-group/lfg-criteres/lfg-criteres.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ISCGameMode } from '../../../common/enums/game-mode.enum';

@Pipe({
  name: 'scSubModeByMode'
})
export class ScSubModeByModePipe implements PipeTransform {

  transform(submodes: ISCHasGameMode[], mode: ISCGameMode): ISCHasGameMode[] {
    return submodes.filter((sub) => sub.gameMode === mode);
  }

}
