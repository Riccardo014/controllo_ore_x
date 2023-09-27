import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  urlApi: string = environment.apiUri + '/users';

  constructor(private _http: HttpClient) {}

  getMany(): Observable<any> {
    return this._http.get<any>(this.urlApi);
  }

}
