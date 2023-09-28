import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { DataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class UserDataService extends DataService<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/users';

  constructor(protected http: HttpClient) {
    super();
  }
}
