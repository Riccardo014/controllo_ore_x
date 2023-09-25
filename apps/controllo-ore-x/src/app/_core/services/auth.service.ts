import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponseDto, UserReadDto } from '@api-interfaces';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly _CURRENT_USER_LS_KEY: string = 'COX_CURRENTUSER';
  private static readonly _TOKEN_LS_KEY: string = 'COX_TOKEN';

  loggedInUser?: UserReadDto;
  token?: string;

  private _loginUri: string = environment.apiUri + '/auth/login';

  constructor(private _http: HttpClient) {
    this._reloadState();
  }

  /**
   * Checks if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Logs out the current user and clears the localStorage.
   */
  logout(): void {
    localStorage.clear();
    this.loggedInUser = undefined;
    this.token = undefined;
  }

  /**
   * Performs user login with the provided email and password.
   */
  async login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this._http.post<LoginResponseDto>(this._loginUri, { email, password }).subscribe({
        next: (loginResponse) => {
          if (loginResponse) {
            this.loggedInUser = loginResponse.user;
            this.token = loginResponse.token;
            this._saveState();
            return resolve(true);
          }
          return resolve(false);
        },
        error: () => {
          return resolve(false);
        },
      });
    });
  }

  /**
   * Saves the current user and authentication token to local storage.
   */
  private _saveState(): void {
    localStorage.setItem(AuthService._CURRENT_USER_LS_KEY, JSON.stringify(this.loggedInUser));
    localStorage.setItem(AuthService._TOKEN_LS_KEY, this.token!);
  }

  /**
   * Reloads authentication state from local storage.
   */
  private _reloadState(): void {
    const currentUserString: string | null = localStorage.getItem(AuthService._CURRENT_USER_LS_KEY);
    this.loggedInUser = currentUserString ? (JSON.parse(currentUserString) as UserReadDto) : undefined;

    const tokenString: string | null = localStorage.getItem(AuthService._TOKEN_LS_KEY);
    this.token = tokenString || undefined;
  }




  
}