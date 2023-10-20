import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseDto, UserReadDto } from '@api-interfaces';
import { environment } from '@env';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly _CURRENT_USER_LS_KEY: string = 'COX_CURRENTUSER';
  private static readonly _TOKEN_LS_KEY: string = 'COX_TOKEN';

  loggedInUser?: UserReadDto;
  authToken?: string;

  private _loginUri: string = environment.apiUri + '/auth/login';

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) {
    this._loadState();
  }

  /**
   * Checks if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Logs out the current user and clears the localStorage.
   */
  logout(): void {
    localStorage.clear();
    this.loggedInUser = undefined;
    this.authToken = undefined;
    this._router.navigate(['/']);
  }

  /**
   * Performs user login with the provided email and password.
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      const loginResponse = await lastValueFrom(
        this._http.post<LoginResponseDto>(this._loginUri, { email, password }),
      );

      if (loginResponse) {
        this.loggedInUser = loginResponse.user;
        this.authToken = loginResponse.token;
        this._saveState();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Saves the current user and authentication token to local storage.
   */
  private _saveState(): void {
    localStorage.setItem(
      AuthService._CURRENT_USER_LS_KEY,
      JSON.stringify(this.loggedInUser),
    );
    localStorage.setItem(AuthService._TOKEN_LS_KEY, this.authToken!);
  }

  /**
   * Reloads authentication state from local storage.
   */
  private _loadState(): void {
    const storedLoggedInUser: string | null = localStorage.getItem(
      AuthService._CURRENT_USER_LS_KEY,
    );
    this.loggedInUser = storedLoggedInUser
      ? (JSON.parse(storedLoggedInUser) as UserReadDto)
      : undefined;

    const storedAuthToken: string | null = localStorage.getItem(
      AuthService._TOKEN_LS_KEY,
    );
    this.authToken = storedAuthToken || undefined;
  }
}
