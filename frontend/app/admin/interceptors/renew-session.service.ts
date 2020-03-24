import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RenewSessionService implements HttpInterceptor {

  constructor( public userService: UserService ) {}

  intercept(req: any, next: HttpHandler) {
    if (req.url.includes('renew') || req.url.includes('login')) {
      return next.handle( req );
    } else {
      this.userService.renewSession();
      return next.handle( req );
    }
  }

}
