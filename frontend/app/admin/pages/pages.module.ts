import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountPreferencesComponent } from './account-preferences/account-preferences.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './user/new-user/new-user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from '../interceptors/http-error.service';
import { UserTokenService } from '../interceptors/user-token.service';
import { RenewSessionService } from '../interceptors/renew-session.service';

@NgModule({
  declarations: [
    AccountPreferencesComponent,
    AccountProfileComponent,
    DashboardComponent,
    LoginComponent,
    NewUserComponent,
    UserListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserTokenService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RenewSessionService,
      multi: true
    }
  ]
})

export class PagesModule {}
