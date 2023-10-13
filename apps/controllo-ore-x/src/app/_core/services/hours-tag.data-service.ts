import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HoursTagCreateDto,
  HoursTagReadDto,
  HoursTagUpdateDto,
} from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class HoursTagDataService extends BaseDataService<
  HoursTagReadDto,
  HoursTagCreateDto,
  HoursTagUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/hoursTags';

  constructor(protected http: HttpClient) {
    super();
  }
}
