import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FindBoostedOptions, FindBoostedResult, IRtWrapBase, UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  urlApi: string = environment.apiUri + '/users';

  constructor(private _http: HttpClient) {}
  getManyFb(body: FindBoostedOptions): Observable<FindBoostedResult<UserReadDto>> {
    return this._http.post<FindBoostedResult<UserReadDto>>(`${this.urlApi}/fb`, body);
  }

  create(body: UserCreateDto): Observable<IRtWrapBase<UserReadDto>> {
    return this._http.post<IRtWrapBase<UserReadDto>>(this.urlApi, body);
  }

  update(id: string, body: UserUpdateDto): Observable<IRtWrapBase<UserReadDto>> {
    return this._http.put<IRtWrapBase<UserReadDto>>(`${this.urlApi}/${id}`, body);
  }

  delete(id: string): Observable<IRtWrapBase<any>> {
    return this._http.delete<IRtWrapBase<any>>(`${this.urlApi}/${id}`);
  }

}
