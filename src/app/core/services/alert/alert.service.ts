import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertEnum } from '../../enums/alert.enums';

@Injectable()
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translate: TranslateService,
  ) { }

  showAlert(
    message: string,
    header: string = this.translate.instant(AlertEnum.defaultHeader),
    subHeader: string = this.translate.instant(AlertEnum.defaultSubHeader),
    buttons: string[] = ['OK']
  ) {
    this.alertController.create({
      header,
      subHeader,
      message,
      buttons,
    }).then((res) => res.present());
  }
}
