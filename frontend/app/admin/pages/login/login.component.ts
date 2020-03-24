import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/admin/services/user.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

declare function pluginsInit(): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( public userService: UserService, public router: Router ) {

    this.loginForm = new FormGroup({
      email: new FormControl( '', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password: new FormControl( '', [Validators.required, Validators.minLength(8)] ),
      remember: new FormControl( false )
    });

    if (this.userService.token && this.userService.user) {
      this.router.navigate(['/admin/inicio']);
      return;
    }

    if (localStorage.getItem('loginEmail')) {
      this.loginForm.patchValue({
        email: localStorage.getItem('loginEmail'),
        remember: true
      });
    }

  }

  ngOnInit(): void {
    pluginsInit();
  }

  logIn() {
    if (this.loginForm.valid) {
      this.userService.login({email: this.loginForm.value.email, password: this.loginForm.value.password}, this.loginForm.value.remember)
      .subscribe((correctLogin: any) => {
        if (correctLogin) {
          this.router.navigate(['/admin']);
        }
      });
    }
  }

}
