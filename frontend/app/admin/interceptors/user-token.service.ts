import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class UserTokenService implements HttpInterceptor {

  constructor( public userService: UserService ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({Authorization: this.userService.token || ''});
    const reqClone = req.clone({headers});
    return next.handle( reqClone );
  }

}
