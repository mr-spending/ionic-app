import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../../core/utils/custom-validators.class';
import { AuthRoutesEnum, MainRoutesEnum } from '../../../core/enums/routing.enums';
import { PrivacyNoticeModalComponent } from 'src/app/pages/settings-page/privacy-notice-modal/privacy-notice-modal.component';

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
    private modalCtrl: ModalController,
  ) {
    this.formGroup = this.fb.group(
      {
        email: this.fb.control(null, [Validators.required, Validators.email]),
        password: this.fb.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
        confirmPassword: this.fb.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      },
      {
        validators: CustomValidators.matchControls('password', 'confirmPassword')
      }
    );
  }

  signUp(): void {
    const formValue = this.formGroup.value;
    this.authService.signUp(formValue.email, formValue.password, true).then();
  }

  goToSignIn(): void {
    this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignIn}`]).then();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  async privacyNoticeModal() {
    const modal = await this.modalCtrl.create({
      component: PrivacyNoticeModalComponent,
      componentProps: { confirmation: true },
      cssClass: 'fullscreen'
    });
    modal.present();
    modal.onDidDismiss()
    .then((data) => {
      if(data['data']) this.signUp();
    });
  }
}
