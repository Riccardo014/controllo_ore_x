import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ReleaseCreateDto,
  ReleaseReadDto,
  ReleaseUpdateDto,
} from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ReleaseDataService extends BaseDataService<
  ReleaseReadDto,
  ReleaseCreateDto,
  ReleaseUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/releases';

  constructor(protected http: HttpClient) {
    super();
  }
}
