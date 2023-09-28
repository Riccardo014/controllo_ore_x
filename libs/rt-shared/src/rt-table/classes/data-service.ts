import { HttpClient } from '@angular/common/http';
import {
  ApiPaginatedResponse,
  ApiResponse,
  FindBoostedOptions,
} from '@api-interfaces';
import { Observable } from 'rxjs';

export abstract class DataService<T, CreateT, UpdateT> {
  protected abstract currentApiUri: string;
  protected abstract http: HttpClient;

  getMany(params: FindBoostedOptions): Observable<ApiPaginatedResponse<T>> {
    return this.http.post<ApiPaginatedResponse<T>>(
      `${this.currentApiUri}/fb`,
      params,
    );
  }

  create(data: CreateT): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.currentApiUri, data);
  }

  update(id: string | number, data: UpdateT): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.currentApiUri}/${id}`, data);
  }

  delete(id: string | number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.currentApiUri}/${id}`);
  }

  getOne(id: string | number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.currentApiUri}/${id}`);
  }
}
