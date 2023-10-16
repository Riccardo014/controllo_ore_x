import { MatDialogRef } from '@angular/material/dialog';
import { RT_DIALOG_CLOSE_RESULT } from '../../enums/rt-dialog-close-result.enum';

/**
 * Dialog default implementation. It should have 2 buttons: "Cancel" and "Ok".
 */
export abstract class RtDialog {
  /**
   * Implementation with get and set is needed to handle auto disable in advanced cases
   * @protected
   */
  protected _isLoading: boolean = false;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  /**
   * Boolean value that represents the presence of errors into the dialog
   */
  hasErrors: boolean = false;

  /**
   * Default call to dialog ref. It should be set on the constructor of the derived class.
   * @protected
   */
  protected abstract _matDialogRef: MatDialogRef<RtDialog>;

  /**
   * It should handle the behavior of the "Ok" button
   */
  abstract onSubmit(): void;

  /**
   * Default "Cancel" action.
   */
  cancel(): void {
    this._matDialogRef.close({
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    });
  }
}
