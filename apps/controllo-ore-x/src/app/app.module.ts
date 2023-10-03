import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatMenuModule,
  ],
  providers: [
    {
      // `subscriptSizing` removes the bottom space of the mat-form-fields <DOCS URL>.
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
