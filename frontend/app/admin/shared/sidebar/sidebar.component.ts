import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent {

  constructor( public userService: UserService, public router: Router ) {}

  logout() {
    this.userService.logout();
    this.router.navigate(['/admin/login']);
  }

}
