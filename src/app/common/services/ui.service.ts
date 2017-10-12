import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class UiService {

  constructor(protected snack: MatSnackBar) { }


  /**
   * Opens a snack-bar app-wide.
   * @param message 
   * @param action 
   */
  public openSnackBar(message: string, action?: string) {
    this.snack.open(message, action, { duration: 5000 });
  }

}
