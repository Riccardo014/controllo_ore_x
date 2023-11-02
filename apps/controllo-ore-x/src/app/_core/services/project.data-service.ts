import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService extends BaseDataService<
  ProjectReadDto,
  ProjectCreateDto,
  ProjectUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/projects';

  constructor(protected http: HttpClient) {
    super();
  }
}
