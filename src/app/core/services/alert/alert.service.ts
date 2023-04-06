import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  showAlert(
    message: string,
    header: string = 'Alert',
    subHeader: string = 'Important message',
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
