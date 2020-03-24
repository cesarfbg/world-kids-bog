import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {

  constructor( public userService: UserService, public router: Router ) {}

  canActivate(): boolean {
    if (this.userService.loginVerify()) {
      return true;
    } else {
      this.router.navigate(['/admin/login']);
      return false;
    }
  }

}
