import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  constructor( public userService: UserService, public router: Router ) {}

  logout() {
    this.userService.logout();
    this.router.navigate(['/admin/login']);
  }

}
