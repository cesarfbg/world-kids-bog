import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class HttpErrorInterceptor implements HttpInterceptor {

  constructor( public router: Router, public userService: UserService ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle( req )
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  handleError( error: HttpErrorResponse ) {

    let errorObj: any;

    try {
      errorObj = error.error.err.errors;
    } catch {
      try {
        errorObj = error.error.message;
      } catch {
        errorObj = 'No hay descripción del error.';
      }
    }

    switch (error.status) {
      case 400:
        let message = '';
        if (typeof errorObj !== 'string') {
          const errKeys = Object.keys(errorObj);
          errKeys.forEach((err) => {
            message += `${errorObj[err].message} <br>`;
          });
        } else {
          message = errorObj;
        }
        this.sendSwalError(message);
        break;

      case 401:
        this.sendSwalError(error.error.message);
        this.userService.logout();
        this.router.navigate(['/admin/login']);
        break;

      default:
        this.sendSwalError('Ocurrió un error, intente de nuevo en unos minutos, si el error persiste contacte al desarrollador.');
    }
    return throwError(errorObj);
  }

  sendSwalError( message: string ) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: '¡Ocurrió un error!',
      html: message,
      showConfirmButton: true,
    });
  }

}
