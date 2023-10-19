import { RT_DIALOG_CLOSE_RESULT } from '../enums/rt-dialog-close-result.enum';

export interface IRtDialogClose<T = any> {
  result: RT_DIALOG_CLOSE_RESULT;
  data?: T;
}
