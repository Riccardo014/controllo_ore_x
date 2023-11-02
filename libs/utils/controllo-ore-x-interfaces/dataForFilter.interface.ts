import { FormControl } from '@angular/forms';
import { COX_FILTER } from '../../api-interfaces/src';

export interface DataForFilter {
  list: any[];
  singleLabel: string;
  multiLabel: string;
  fieldName: COX_FILTER;
  formControl: FormControl;
}
