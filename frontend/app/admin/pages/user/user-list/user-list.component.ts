import { Component } from '@angular/core';
import IUser from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})

export class UserListComponent {

  users: IUser[] = [];
  usersCount = 0;
  shownUsers: IUser[] = [];
  usersLoaded = false;

  constructor( public userService: UserService, public router: Router ) {
    this.getUsers();
  }

  async getUsers() {
    this.userService.getUsers()
      .subscribe((resp: any) => {
        this.users = resp.users;
        this.usersCount = resp.count;
        this.usersLoaded = true;
        this.sortUsers();
      });
  }

  sortUsers() {
    const sortedUsers: IUser[] = [];
    const selfUser: IUser[] = [];
    const adminUsers: IUser[] = [];
    const otherUsers: IUser[] = [];
    this.users.forEach((user: IUser) => {
      if (user._id === this.userService.user._id) {
        selfUser.push(user);
      } else if (user.role === 'ADMIN_ROLE') {
        adminUsers.push(user);
      } else {
        otherUsers.push(user);
      }
    });
    sortedUsers.push(...selfUser);
    sortedUsers.push(...adminUsers);
    sortedUsers.push(...otherUsers);
    this.shownUsers = sortedUsers;
  }

  findUsers( input: any ) {
    let findParam = input.value;
    findParam = findParam.toLowerCase();
    if (findParam.length > 0) {
      this.shownUsers = this.users.filter((user) =>
        user.name.toLowerCase().indexOf(findParam) !== -1 ||
        user.email.toLowerCase().indexOf(findParam) !== -1 ||
        user.role.toLowerCase().indexOf(findParam) !== -1);
    } else {
      this.shownUsers = this.users;
    }
  }

  changeUserStatus( user: IUser ) {
    if (user._id !== this.userService.user._id) {
      Swal.fire({
        title: '¿Está seguro?',
        html: `Está a punto de ${user.status ? 'inhabilitar' : 'habilitar'} a <b>${user.name}</b>`,
        icon: 'warning',
        focusCancel: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: `${user.status ? 'Inhabilitar' : 'Habilitar'}`
      }).then((result) => {
        if (result.value) {
          user.status = !user.status;
          this.userService.updateUser(user).subscribe((resp) => {});
        }
      });
    }
  }

  changeUserRole( user: IUser ) {
    if (user._id !== this.userService.user._id) {
      Swal.fire({
        title: '¿Está seguro?',
        html: `Está a punto de cambiar el rol de ${user.name} a <b>${user.role === 'ADMIN_ROLE' ? 'Administrador' : 'Editor'}</b>`,
        icon: 'warning',
        focusCancel: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: `Cambiar`
      }).then((result) => {
        if (result.value) {
          this.userService.updateUser(user).subscribe();
        } else {
          user.role = user.role === 'ADMIN_ROLE' ? 'USER_ROLE' : 'ADMIN_ROLE';
        }
      });
    }
  }

  changeUserName( user: IUser ) {
    Swal.fire({
      title: 'Modificar nombre de usuario',
      html: `¿Cuál es el nuevo nombre que desea asignar al usuario <b>${user.email}</b>?<br>`,
      input: 'text',
      icon: 'question',
      inputValue: user.name,
      inputValidator: result => !result && 'El nombre no puede estar vacío!' ||
                      result.length < 5 && 'El nombre debe contener mínimo 5 caracteres.' ||
                      result.length > 18 && 'El nombre debe contener máximo 18 caracteres.',
      inputAttributes: {
        autocapitalize: 'on',
      },
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      focusConfirm: true,
      preConfirm: async (name) => {
        const confirmation = await Swal.fire({
          title: '¿Está seguro?',
          html: `Está a punto de cambiar el nombre del usuario ${user.email} a <b>${name}</b>`,
          icon: 'warning',
          showCancelButton: true,
          focusConfirm: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonColor: '#3085d6',
          confirmButtonText: `Cambiar`
        });
        if (confirmation.value) {
          user.name = name;
          this.userService.updateUser(user).subscribe();
          if (user._id === this.userService.user._id) {
            this.userService.renewSession();
          }
        }
      }
    });
  }

  changeUserEmail( user: IUser ) {
    Swal.fire({
      title: 'Modificar email de usuario',
      html: `¿Cuál es el nuevo email que desea asignar a <b>${user.name}</b>?<br>`,
      input: 'email',
      icon: 'question',
      inputValue: user.email,
      validationMessage: 'Debe ingresar un email válido.',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      focusConfirm: true,
      preConfirm: async (email) => {
        const confirmation = await Swal.fire({
          title: '¿Está seguro?',
          html: `Está a punto de cambiar el email del usuario ${user.name} a <b>${email}</b>`,
          icon: 'warning',
          showCancelButton: true,
          focusConfirm: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonColor: '#3085d6',
          confirmButtonText: `Cambiar`
        });
        if (confirmation.value) {
          user.email = email;
          this.userService.updateUser(user).subscribe();
          if (user._id === this.userService.user._id) {
            this.userService.renewSession();
          }
        }
      }
    });
  }

  changeUserPassword( user: IUser ) {
    Swal.fire({
      title: 'Modificar contraseña de usuario',
      html: `Ingrese la contraseña que desea asignar a <b>${user.name}</b><br>`,
      input: 'password',
      icon: 'question',
      inputValidator: result => !result && '¡La contraseña no puede estar vacía!' ||
                      result.length < 8 && 'La contraseña debe contener mínimo 8 caracteres.',
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      focusConfirm: true,
      preConfirm: (password1) => {
        Swal.fire({
          title: 'Modificar contraseña de usuario',
          html: `Ingrese de nuevo la contraseña<br>`,
          input: 'password',
          icon: 'question',
          inputValidator: result => !result && '¡La contraseña no puede estar vacía!' ||
                          result.length < 8 && 'La contraseña debe contener mínimo 8 caracteres.' ||
                          result !== password1 && 'Las contraseñas no coinciden.',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          focusConfirm: true,
          preConfirm: async (password2) => {
            if (password1 === password2) {
              const confirmation = await Swal.fire({
                title: '¿Está seguro?',
                html: `Está a punto de cambiar la contraseña del usuario ${user.name}`,
                icon: 'warning',
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Cambiar`
              });
              if (confirmation.value) {
                user.password = password1;
                this.userService.updateUser(user).subscribe();
                if (user._id === this.userService.user._id) {
                  this.userService.renewSession();
                }
              }
            }
          }
        });
      }
    });
  }

}
