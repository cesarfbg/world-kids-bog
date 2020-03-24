import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import IUser from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html'
})

export class AccountProfileComponent {

  profileForm: FormGroup;
  hoverImg = false;

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password1 = control.get('password1').value;
    const password2 = control.get('password2').value;
    return password1 === password2 ? null : {passwordsMatch: true};
  }

  constructor( public userService: UserService, public router: Router, public http: HttpClient ) {
    this.profileForm = new FormGroup({
      _id: new FormControl( userService.user._id ),
      name: new FormControl( userService.user.name, [Validators.required, Validators.minLength(5), Validators.maxLength(18)] ),
      email: new FormControl( userService.user.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password1: new FormControl( '***************', [Validators.required, Validators.minLength(8)] ),
      password2: new FormControl( '***************')
    }, {
      validators: [this.passwordsMatchValidator]
    });
  }

  updateUser() {
    const keys = Object.keys(this.profileForm.value);
    const updatedUser: any = { _id: this.userService.user._id };
    keys.forEach((key) => {
      if (!this.profileForm.controls[key].pristine) {
        updatedUser[key] = this.profileForm.controls[key].value;
      }
    });
    if (updatedUser.password1) {
      updatedUser.password = updatedUser.password1;
      delete updatedUser.password1;
      delete updatedUser.password2;
    }
    this.userService.updateUser(updatedUser).subscribe((resp: any) => {
      if (resp.ok) {
        this.userService.renewSession();
        Swal.fire({
          title: 'Perfil actualizado',
          text: 'Perfil actualizado con éxito',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });
      }
    });
  }

  changeImg() {
    Swal.fire({
      title: 'Nueva imagen de perfil',
      icon: 'info',
      customClass: {
        content: 'text-left'
      },
      html: `<b>Enlaces válidos:</b><br>
      <small>- Enlaces de imágenes en google drive (Recomendado)<br></small>
      <small>- Enlaces públicos con extensión .jpg</small>`,
      input: 'text',
      inputValidator: result => !result && '¡La URL no puede estar vacía!' ||
                                !(result.substr(-4, 4) === '.jpg' || result.indexOf('drive.google.com') !== -1)  && 'La URL no es válida.',
      showCancelButton: true,
      focusConfirm: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: `Cambiar`,
      preConfirm: async (result: string) => {
        let imgUrl = '';
        if (result.indexOf('drive.google.com') !== -1) {
          if (result.indexOf('/open?id=') !== -1) {
            imgUrl = result.substr(result.indexOf('/open?id=') + 9, result.length);
            imgUrl = `https://drive.google.com/uc?id=${imgUrl}`;
          } else if (result.indexOf('/view') !== -1) {
            imgUrl = result.substr(result.indexOf('/file/d/') + 8, result.length);
            imgUrl = imgUrl.substr(0, imgUrl.indexOf('/'));
            imgUrl = `https://drive.google.com/uc?id=${imgUrl}`;
          } else {
            imgUrl = result;
          }
        } else {
          imgUrl = result;
        }

        const updatedUser: IUser = this.userService.user;
        updatedUser.img = imgUrl;

        this.userService.updateUser(updatedUser)
        .subscribe(() => {
          this.userService.renewSession();
          Swal.fire({
            title: 'Imagen actualizada',
            text: 'Imagen actualizada con éxito',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
        });
      }
    });
  }

}
