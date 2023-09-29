import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { DataService } from '@controllo-ore-x/rt-shared';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamDataService extends DataService<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
> {
  currentApiUri: string = environment.apiUri + '/users';

  constructor(protected http: HttpClient) {
    super();
  }

  getUser(id: string | number): Observable<UserReadDto> {
    return this.http.get<UserReadDto>(`${this.currentApiUri}/${id}`);
  }

}
