import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DayoffCreateDto,
  DayoffReadDto,
  DayoffUpdateDto,
} from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class DayoffDataService extends BaseDataService<
  DayoffReadDto,
  DayoffCreateDto,
  DayoffUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/dayoffs';

  constructor(protected http: HttpClient) {
    super();
  }
}
