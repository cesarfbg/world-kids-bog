import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import IUser from '../../../interfaces/user.interface';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html'
})

export class NewUserComponent {

  userForm: FormGroup;

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password1 = control.get('password1').value;
    const password2 = control.get('password2').value;
    return password1 === password2 ? null : {passwordsMatch: true};
  }

  constructor( public userService: UserService ) {
    this.userForm = new FormGroup({
      name: new FormControl( '', [Validators.required, Validators.minLength(5), Validators.maxLength(18)] ),
      email: new FormControl( '', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password1: new FormControl( '', [Validators.required, Validators.minLength(8)] ),
      password2: new FormControl(),
      role: new FormControl( 'USER_ROLE', [Validators.required] ),
      status: new FormControl(true, [Validators.required])
    }, {
      validators: [this.passwordsMatchValidator]
    });
    this.resetInputs();
  }

  resetInputs() {
    this.userForm.reset();
    this.userForm.patchValue({
      role: 'USER_ROLE',
      status: true,
    });
  }

  createUser() {

    if ( this.userForm.valid ) {

      const user: IUser = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        password: this.userForm.value.password1,
        role: this.userForm.value.role,
        status: this.userForm.value.status
      };

      this.userService.createUser( user )
      .subscribe((createdUser) => {
        if (createdUser) {
          this.resetInputs();
        }
      });

    }

  }

}
