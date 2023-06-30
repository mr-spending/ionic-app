import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../../core/utils/custom-validators.class';
import { AuthRoutesEnum, MainRoutesEnum } from '../../../core/enums/routing.enums';
import { PrivacyNoticeModalComponent } from 'src/app/pages/settings-page/privacy-notice-modal/privacy-notice-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { UserActions } from '../../../core/state/actions/user.actions';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  formGroup: FormGroup;
  showPassword = false;
  languageList: string[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private translateService: TranslateService
  ) {
    this.languageList = this.translateService.getLangs();
    this.formGroup = this.fb.group(
      {
        email: this.fb.control(null, [Validators.required, Validators.email]),
        password: this.fb.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
        confirmPassword: this.fb.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
        language: this.fb.control(this.languageList[0], Validators.required)
      },
      {
        validators: CustomValidators.matchControls('password', 'confirmPassword')
      }
    );
  }

  signUp(): void {
    const formValue = this.formGroup.value;
    this.authService.signUp(formValue.email, formValue.password, formValue.language, true).then();
  }

  goToSignIn(): void {
    this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignIn}`]).then();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  languageChange(language: string): void {
    this.translateService.use(language);
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
