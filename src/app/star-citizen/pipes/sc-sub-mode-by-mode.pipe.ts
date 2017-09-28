import { ISCGameMode } from './../../../common/interfaces/star-citizen/game-mode.interface';
import { ISCGameSubMode } from './../../../common/interfaces/star-citizen/game-sub-mode.interface';
import { ISCDisplaySubMode, ISCHasGameMode } from './../components/looking-for-group/lfg-criteres/lfg-criteres.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ISCDefaultGameMode } from '../../../common/enums/game-mode.enum';

@Pipe({
  name: 'scSubModeByMode'
})
export class ScSubModeByModePipe implements PipeTransform {

  transform(submodes: ISCGameSubMode[], mode: ISCGameMode): ISCGameSubMode[] {
    return submodes.filter((submode) => {
      return submode.gameMode.name === mode.name;
    });
  }

}
