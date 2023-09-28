import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FindBoostedOptions,
  FindBoostedResult,
  IRtWrapBase,
  RoleCreateDto,
  RoleReadDto,
  RoleUpdateDto,
} from '@api-interfaces';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleDataService {
  urlApi: string = environment.apiUri + '/roles';

  constructor(private _http: HttpClient) {}
  getManyFb(
    body: FindBoostedOptions,
  ): Observable<FindBoostedResult<RoleReadDto>> {
    return this._http.post<FindBoostedResult<RoleReadDto>>(
      `${this.urlApi}/fb`,
      body,
    );
  }

  create(body: RoleCreateDto): Observable<IRtWrapBase<RoleReadDto>> {
    return this._http.post<IRtWrapBase<RoleReadDto>>(this.urlApi, body);
  }

  update(
    id: string,
    body: RoleUpdateDto,
  ): Observable<IRtWrapBase<RoleReadDto>> {
    return this._http.put<IRtWrapBase<RoleReadDto>>(
      `${this.urlApi}/${id}`,
      body,
    );
  }
}
