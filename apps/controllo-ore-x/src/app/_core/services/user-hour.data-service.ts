import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class UserHoursDataService extends BaseDataService<
  UserHoursReadDto,
  UserHoursCreateDto,
  UserHoursUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/userHours';

  constructor(protected http: HttpClient) {
    super();
  }
}
