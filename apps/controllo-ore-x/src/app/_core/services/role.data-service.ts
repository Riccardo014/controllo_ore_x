import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoleCreateDto, RoleReadDto, RoleUpdateDto } from '@api-interfaces';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class RoleDataService extends BaseDataService<
  RoleReadDto,
  RoleCreateDto,
  RoleUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/roles';

  constructor(protected http: HttpClient) {
    super();
  }
}
