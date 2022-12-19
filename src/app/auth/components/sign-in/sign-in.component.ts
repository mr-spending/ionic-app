import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AuthRoutesEnum, MainRoutesEnum } from '../../../core/interfaces/enums';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  formGroup: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.formGroup = this.fb.group({
      email: this.fb.control('yurakovalyov77@gmail.com', [Validators.required, Validators.email]),
      password: this.fb.control('12345678', Validators.required)
    });
  }

  signIn(): void {
    const formValue = this.formGroup.value;

    this.authService.signIn(formValue.email, formValue.password).then();
  }

  goToSignUp() {
    this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignUp}`]).then();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
