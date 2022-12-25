import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../core/utils/custom-validators.class';
import { AuthRoutesEnum, MainRoutesEnum } from '../../../core/enums/routing.enums';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  formGroup: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.formGroup = this.fb.group(
      {
        email: this.fb.control(null, [Validators.required, Validators.email]),
        password: this.fb.control(null, Validators.required),
        confirmPassword: this.fb.control(null, Validators.required),
      },
      {
        validators: CustomValidators.matchControls('password', 'confirmPassword')
      }
    );
  }

  signUp(): void {
    const formValue = this.formGroup.value;
    this.authService.signUp(formValue.email, formValue.password).then();
  }

  goToSignIn(): void {
    this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignIn}`]).then();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
