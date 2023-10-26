import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiResponse,
  INDEX_CONFIGURATION_KEY,
  IndexConfigurationReadDto,
} from '@api-interfaces';
import { environment } from '@env';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IndexConfigurationDataService {
  currentApiUri: string = environment.apiUri + '/index-configurations';

  constructor(private _http: HttpClient) {}

  getConfiguration(
    key: INDEX_CONFIGURATION_KEY,
  ): Observable<ApiResponse<IndexConfigurationReadDto>> {
    return this._http.get<ApiResponse<IndexConfigurationReadDto>>(
      `${this.currentApiUri}/${key}`,
    );
  }
}
