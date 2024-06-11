import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { AuthRoutesEnum, MainRoutesEnum } from '../../../core/enums/routing.enums';

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
    public platform: Platform,
  ) {
    this.formGroup = this.fb.group({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, Validators.required)
    });
  }

  signIn(): void {
    const formValue = this.formGroup.value;
    this.authService.signIn(formValue.email, formValue.password).then();
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signInWithGoogleMobile() {
    this.authService.signInWithGoogleMobile()
  }

  goToSignUp() {
    this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignUp}`]).then();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
