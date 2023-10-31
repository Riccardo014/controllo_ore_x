import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivityCreateDto,
  ActivityReadDto,
  ActivityUpdateDto,
} from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ReportDataService extends BaseDataService<
  ActivityReadDto,
  ActivityCreateDto,
  ActivityUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/activitys';

  constructor(protected http: HttpClient) {
    super();
  }
}
