import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import IUser from '../interfaces/user.interface';
import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  backendUrl: string = environment.backendUrl;
  token: string;
  user: IUser;

  constructor( public http: HttpClient ) {
    this.token = localStorage.getItem('token') || '';
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  login( loginCredentials: {email: string, password: string}, remember: boolean ) {
    if (remember) {
      localStorage.setItem('loginEmail', loginCredentials.email);
    } else {
      localStorage.removeItem('loginEmail');
    }
    return this.http.post(`${this.backendUrl}/user/login`, loginCredentials)
    .map((resp: any) => {
      if (resp.ok) {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        this.token = resp.token;
        this.user = resp.user;
      }
      return true;
    });
  }

  loginVerify() {
    return (this.token ? true : false);
  }

  renewSession() {
    const url = `${this.backendUrl}/user/renewSession`;
    this.http.get(url).subscribe((resp: any) => {
      this.token = resp.token;
      this.user = resp.user;
      localStorage.setItem('token', resp.token);
      localStorage.setItem('user', JSON.stringify(resp.user));
    });
  }

  createUser( user: IUser ) {
    const url = `${this.backendUrl}/user/create`;
    return this.http.post( url, user )
    .map((resp: any) => {
      if (resp.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Usuario creado exitosamente!',
          html: `Nombre:${resp.newUser.name}<br>Email:${resp.newUser.email}`,
          showConfirmButton: true,
        });
        return true;
      } else {
        return false;
      }
    });
  }

  getUsers() {
    const url = `${this.backendUrl}/user/get`;
    return this.http.get(url);
  }

  updateUser(user: IUser) {
    const url = `${this.backendUrl}/user/update`;
    return this.http.patch(url, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = '';
    this.user = undefined;
  }

}
