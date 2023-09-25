import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'controllo-ore-x-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit{
  title: string = 'Accedi';

  hasErrors: boolean = false;
  isLoading: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required,Validators.email,]),    
    password: new FormControl(null, Validators.required),
  });

  constructor(private _authService: AuthService, private _router: Router) {}

  /**
   * Check if the user is already authenticated when the component initializes
   */
  ngOnInit(): void {
    if (this._authService.isAuthenticated()) {
      this._redirectToUserAuthenticatedArea();
    }
  }

  /**
   * Try to login the user with the provided credentials.
   */
  async tryLogin():Promise<void> {
    const formValues: any = this.form.getRawValue();
    this.isLoading = true;
    this.hasErrors = false;
    this.form.disable();

    if (await this._authService.login(formValues.email, formValues.password)) {
      await this._redirectToUserAuthenticatedArea();
    } else {
      this.hasErrors = true;
    }

    this.form.enable();
    this.isLoading = false;
  }

  /**
   * Redirects the user to the auth default page.
   */
  private async _redirectToUserAuthenticatedArea(): Promise<void> {
    await this._router.navigate([
      '/auth',
    ]);
  }
  
}

