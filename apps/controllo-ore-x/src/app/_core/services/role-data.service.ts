import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoleCreateDto, RoleReadDto, RoleUpdateDto } from '@api-interfaces';
import { DataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class RoleDataService extends DataService<
  RoleReadDto,
  RoleCreateDto,
  RoleUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/roles';

  constructor(protected http: HttpClient) {
    super();
  }
}
